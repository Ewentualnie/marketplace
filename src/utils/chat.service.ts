import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import Chat from 'src/models/chat.entity';
import MailDto from 'src/models/dto/create-mail.dto';
import Message from 'src/models/message.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat)
    public chatRepository: Repository<Chat>,
    @InjectRepository(Message)
    public messageRepository: Repository<Message>,
    private userService: UsersService,
  ) {}

  async getChat(userId: number, currentUserId: number) {
    const chat = await this.chatRepository
      .createQueryBuilder('chat')
      .leftJoinAndSelect('chat.messages', 'messages')
      .where(
        '(chat.user1 = :userId AND chat.user2 = :currentUserId) OR (chat.user1 = :currentUserId AND chat.user2 = :userId)',
        { userId, currentUserId },
      )
      .orderBy('messages.writtedAt', 'DESC')
      .getOne();
    if (!chat) {
      throw new BadRequestException(
        `There is no chat between user ${currentUserId} and user ${userId}`,
      );
    }

    return chat;
  }

  async getChats(id: number): Promise<Chat[]> {
    const chats = await this.chatRepository
      .createQueryBuilder('chat')
      .leftJoinAndSelect('chat.messages', 'messages')
      .where('chat.user1Id = :id OR chat.user2Id = :id', {
        id,
      })
      .getMany();
    return chats;
  }

  async sendMessage(dto: MailDto, fromUserId: number, toUserId: number) {
    const chat = await this.findOrCreateChat(toUserId, fromUserId);

    const message = this.messageRepository.create({
      isReaded: false,
      text: dto.message,
      chat,
      senderId: fromUserId,
      receiverId: toUserId,
    });

    chat.messages.push(message);
    await this.messageRepository.save(message);
    return await this.chatRepository.save(chat);
  }

  async findOrCreateChat(fromUserId: number, toUserId: number): Promise<Chat> {
    const toUser = await this.userService.getUserWithChats(toUserId);
    const fromUser = await this.userService.getUserWithChats(fromUserId);

    if (toUser.id == fromUser.id) {
      throw new BadRequestException('User cannot send mails to himself');
    }
    let chat = await this.chatRepository
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
    if (!chat) {
      chat = this.chatRepository.create();
      fromUser.chatsAsUser1.push(chat);
      toUser.chatsAsUser2.push(chat);

      chat.user1 = fromUser;
      chat.user2 = toUser;
      chat.messages = [];
      await this.userService.saveUser(fromUser);
      await this.userService.saveUser(toUser);
      await this.chatRepository.save(chat);
    }
    return await this.chatRepository.findOne({
      where: { id: chat.id },
      relations: ['user1', 'user2', 'messages'],
    });
  }
}
