import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from '../models/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateUserDto } from '../models/dto/update-user.dto';
import { CreateFeedback } from '../models/dto/add-feedback.dto';
import { FeedBack } from '../models/feedback.entity';
import { Advert } from 'src/models/advert.entity';
import { CloudinaryService } from 'src/utils/cloudinary.service';
import { UtilsService } from 'src/utils/utils.service';
import { Specialization } from 'src/models/specialization.entity';
import { Mail } from 'src/models/mail.entity';
import { MailDto } from 'src/models/dto/create-mail.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) public usersRepository: Repository<User>,
    @InjectRepository(FeedBack) public feedbackRepository: Repository<FeedBack>,
    @InjectRepository(Advert) private advertRepository: Repository<Advert>,
    @InjectRepository(Mail) private mailRepository: Repository<Mail>,
    private cloudinaryService: CloudinaryService,
    private utilServise: UtilsService,
  ) {}

  async findByEmail(email: string) {
    const user = await this.usersRepository.findOne({
      where: { email: email },
      relations: [
        'advert',
        'hobbies',
        'feedbacksToMe',
        'feedbacksFromMe',
        'country',
        'favoriteAdverts',
      ],
    });
    if (user) return user;
    throw new BadRequestException(`User with email ${email} not found`);
  }

  async findAll() {
    return await this.usersRepository.find({
      relations: [
        'advert',
        'hobbies',
        'feedbacksToMe',
        'feedbacksFromMe',
        'country',
        'favoriteAdverts',
      ],
    });
  }

  async findOne(id: number) {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: [
        'advert',
        'hobbies',
        'feedbacksToMe',
        'feedbacksFromMe',
        'country',
        'favoriteAdverts',
        'receivedMails',
        'sentMails',
      ],
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

  async getSpecializations(
    specializations: number[],
  ): Promise<Specialization[]> {
    const res = (
      await Promise.all(
        specializations.map(
          async (id: number) => await this.utilServise.findSpecialization(id),
        ),
      )
    ).filter((val) => val != null);
    if (res.length == 0) {
      throw new BadRequestException('You must add correct specializations!');
    }
    return res;
  }

  async saveUser(user: User) {
    return await this.usersRepository.save(user);
  }

  async sendMail(dto: MailDto, fromUserId: number, toUserId: number) {
    const toUser = await this.findOne(toUserId);
    const fromUser = await this.findOne(fromUserId);

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
}
