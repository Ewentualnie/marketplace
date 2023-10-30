import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
  ): Promise<void> {
    const user = await this.findOne(userId);
    const currentUser = await this.findOne(currentUserId);

    if (!user || !currentUser) {
      throw new NotFoundException('User not found');
    }

    const newFeedback = this.feedbackRepository.create(feedback);

    newFeedback.toUser = user;

    user.feedbacks.push(newFeedback);

    currentUser.writtenFeedbacks.push(newFeedback);

    await this.usersRepository.save(user);
    await this.usersRepository.save(currentUser);
    await this.feedbackRepository.save(newFeedback);

    return null;
  }
}
