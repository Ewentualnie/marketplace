import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Advert } from 'src/advert/entities/advert.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateFeedback } from './dto/add-feedback.dto';
import { FeedBack } from './entities/feedback.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) public usersRepository: Repository<User>,
    @InjectRepository(FeedBack) public feedbackRepository: Repository<FeedBack>,
  ) {}

  async findByEmail(email: string) {
    const user = await this.usersRepository.findOne({
      where: { email: email },
    });
    if (user) return user;
    throw new BadRequestException(`User with email ${email} not found`);
  }

  async findAll() {
    return await this.usersRepository.find({ relations: ['advert'] });
  }

  async findOne(id: number) {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['advert', 'feedbacks', 'writtenFeedbacks'],
    });
    if (user) return user;
    throw new BadRequestException(`User with id ${id} not found`);
  }

  async updateAdvert(id: number, advert: Advert) {
    return await this.usersRepository.update(id, { advert: advert });
  }

  async softUserDelete(id: number) {
    return await this.usersRepository.update(id, { isDeleted: true });
  }

  async hardUserDelete(id: number) {
    return await this.usersRepository.remove((await this.findOne(id))[0]);
  }

  async updateUserInfo(id: number, updateUserDto: UpdateUserDto) {
    return 'not implemented yet';
  }

  async addFeedback(
    userId: number,
    currentUserId: number,
    feedback: CreateFeedback,
  ) {
    const user = await this.findOne(userId);
    const currentUser = await this.findOne(currentUserId);
    const newFeedback: FeedBack = await this.feedbackRepository.create(
      feedback,
    );

    // console.log('before', newFeedback);
    user.feedbacks.push(newFeedback);
    currentUser.writtenFeedbacks.push(newFeedback);
    // add new feedback to user, working good, need to save changes in user entity
    // add new writtenfeedback to current user, working good, need to save changes in current user entity
    this.usersRepository.update(user, { feedbacks: user.feedbacks });
    // не зберігається поле фідбеків
    console.log(user);

    newFeedback.toUser = user;
    // newFeedback.fromUsers.push(currentUser);
    //тут поля фромюзерс взагалі нема

    console.log(newFeedback);

    // this.feedbackRepository.save(newFeedback);

    // throw new Error('Method not implemented.');

    return null;
  }
}
