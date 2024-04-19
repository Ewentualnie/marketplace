import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from '../models/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateUserDto } from '../models/dto/update-user.dto';
import { CreateFeedback } from '../models/dto/add-feedback.dto';
import { FeedBack } from '../models/feedback.entity';
import { Advert } from 'src/models/advert.entity';
import { CloudinaryService } from 'src/utils/cloudinary.service';
import { UtilsService } from 'src/utils/utils.service';
import { Mail } from 'src/models/mail.entity';
import { MailDto } from 'src/models/dto/create-mail.dto';
import { Message } from 'src/models/message.entity';
import { Chat } from 'src/models/chat.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) public usersRepository: Repository<User>,
    @InjectRepository(FeedBack) public feedbackRepository: Repository<FeedBack>,
    @InjectRepository(Advert) private advertRepository: Repository<Advert>,
    @InjectRepository(Mail) private mailRepository: Repository<Mail>,
    @InjectRepository(Message) private messageRepository: Repository<Message>,
    @InjectRepository(Chat) private chatRepository: Repository<Chat>,
    private cloudinaryService: CloudinaryService,
    private utilServise: UtilsService,
  ) {}

  async findByEmail(email: string) {
    const user = await this.usersRepository.findOne({
      where: { email: email },
      relations: ['advert', 'feedbacksToMe', 'feedbacksFromMe', 'country'],
    });
    if (user) return user;
    throw new BadRequestException(`User with email ${email} not found`);
  }

  async findAll() {
    return await this.usersRepository.find({
      relations: ['advert', 'feedbacksToMe', 'feedbacksFromMe', 'country'],
    });
  }

  async findOne(id: number) {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['advert', 'feedbacksToMe', 'feedbacksFromMe', 'country'],
    });
    if (user) return user;
    throw new BadRequestException(`User with id ${id} not found`);
  }

  async getUserWithLikes(id: number) {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['likes'],
    });
    if (user) return user;
    throw new BadRequestException(`User with id ${id} not found`);
  }

  async updateAdvert(id: number, advert: Advert) {
    return await this.usersRepository.update(id, { advert: advert });
  }

  async hardUserDelete(id: number) {
    return await this.usersRepository.remove(await this.findOne(id));
  }

  async deleteRestoreUser(id: number) {
    const user = await this.findOne(id);
    if (user.advert && !user.advert.isDeleted) {
      const advert = await this.advertRepository.findOne({
        where: { id: user.advert.id },
      });
      advert.isDeleted = !advert.isDeleted;
      await this.advertRepository.save(advert);
    }
    user.isDeleted = !user.isDeleted;
    return this.usersRepository.save(user);
  }

  async updateUserInfo(
    id: number,
    updateUserDto: UpdateUserDto,
    photo?: Express.Multer.File,
  ): Promise<User> {
    const user = await this.findOne(id);

    user.firstName = updateUserDto.firstName ?? user.firstName;
    user.lastName = updateUserDto.lastName ?? user.lastName;
    user.birthday = updateUserDto.birthday ?? user.birthday;
    user.sex = updateUserDto.sex ?? user.sex;
    user.aboutMe = updateUserDto.aboutMe ?? user.aboutMe;

    if (updateUserDto.country) {
      user.country =
        (await this.utilServise.findCountry(updateUserDto.country)) ??
        user.country;
    }

    if (photo) {
      if (user.photoPath) {
        this.cloudinaryService.deleteFile(user.photoPath);
      }
      const res = await this.cloudinaryService.uploadFile(photo);
      user.photoPath = res.url;
      console.log(
        `User with id ${user.id}, upload photo with public_id: ${res.public_id}`,
      );
    }

    return await this.usersRepository.save(user);
  }

  async getConversation(userId: number, currentUserId: number) {
    const chatMails = await this.mailRepository
      .createQueryBuilder('mail')
      .where(
        '(mail.fromUser = :userId AND mail.toUser = :currentUserId) OR (mail.fromUser = :currentUserId AND mail.toUser = :userId)',
        { userId, currentUserId },
      )
      .orderBy('mail.writtedAt', 'DESC')
      .getMany();

    return chatMails;
  }

  async addFeedback(
    userId: number,
    currentUserId: number,
    feedback: CreateFeedback,
  ): Promise<FeedBack> {
    const user = await this.findOne(userId);
    const currentUser = await this.findOne(currentUserId);

    if (user.id == currentUser.id) {
      throw new BadRequestException(
        'The user cannot write feedback to himself',
      );
    }

    const newFeedback = this.feedbackRepository.create(feedback);

    user.feedbacksToMe.push(newFeedback);
    currentUser.feedbacksFromMe.push(newFeedback);
    currentUser.lastVisit = new Date();

    if (user.feedbacksToMe.length > 0) {
      user.rating =
        user.feedbacksToMe.reduce((sum, feedback) => sum + feedback.mark, 0) /
        user.feedbacksToMe.length;
    }

    await this.usersRepository.save([user, currentUser]);

    return await this.feedbackRepository.save(newFeedback);
  }

  async getMails(id: number): Promise<Mail[]> {
    return (
      await this.usersRepository.findOne({
        where: { id },
        relations: ['receivedMails'],
      })
    ).receivedMails;
  }

  async saveUser(user: User) {
    return await this.usersRepository.save(user);
  }

  async sendMail(dto: MailDto, fromUserId: number, toUserId: number) {
    const toUser = await this.usersRepository.findOne({
      where: { id: toUserId },
      relations: ['receivedMails'],
    });
    const fromUser = await this.usersRepository.findOne({
      where: { id: fromUserId },
      relations: ['sentMails'],
    });

    if (toUser.id == fromUser.id) {
      throw new BadRequestException('User cannot send mails to himself');
    }

    const mail = this.mailRepository.create({ ...dto, isReaded: false });

    toUser.receivedMails.push(mail);
    fromUser.sentMails.push(mail);
    fromUser.lastVisit = new Date();

    await this.usersRepository.save([toUser, fromUser]);

    return await this.mailRepository.save(mail);
  }

  async findOrCreateChat(dto: MailDto, fromUserId: number, toUserId: number) {
    const toUser = await this.usersRepository.findOne({
      where: { id: toUserId },
      relations: ['chatsAsUser1', 'chatsAsUser2'],
    });
    const fromUser = await this.usersRepository.findOne({
      where: { id: fromUserId },
      relations: ['chatsAsUser1', 'chatsAsUser2'],
    });
    if (!fromUser || !toUserId) {
      throw new NotFoundException('Sender or receiver not found');
    }
    if (toUser.id == fromUser.id) {
      throw new BadRequestException('User cannot send mails to himself');
    }

    const chat = await this.chatRepository
      .createQueryBuilder('chat')
      .leftJoinAndSelect('chat.messages', 'messages')
      .leftJoinAndSelect('chat.user1', 'user1')
      .leftJoinAndSelect('chat.user2', 'user2')
      .where(
        '(chat.user1Id = :fromUserId AND chat.user2Id = :toUserId) OR (chat.user1Id = :toUserId AND chat.user2Id = :fromUserId)',
        {
          fromUserId,
          toUserId,
        },
      )
      .getOne();

    const message = this.messageRepository.create({ isReaded: false });
    message.text = dto.message;

    if (!chat) {
      const newChat = this.chatRepository.create();
      newChat.user1 = fromUser;
      newChat.user2 = toUser;

      fromUser.chatsAsUser1.push(newChat);
      toUser.chatsAsUser2.push(newChat);
      await this.usersRepository.save([fromUser, toUser]);

      message.chat = newChat;
      console.log(message);
      await this.messageRepository.save(message);
      console.log(newChat);
      newChat.messages = [message];

      console.log('in if');

      console.log(newChat);

      return await this.chatRepository.save(newChat);
    } else {
      message.chat = chat;
      await this.messageRepository.save(message);

      chat.messages.push(message);

      console.log('in else');

      console.log(chat);

      return await this.chatRepository.save(chat);
    }
  }
}
