import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from '../models/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateUserDto } from '../models/dto/update-user.dto';
import { CreateFeedback } from '../models/dto/add-feedback.dto';
import { FeedBack } from '../models/feedback.entity';
import { Hobby } from '../models/hobby.entity';
import { Advert } from 'src/models/advert.entity';
import { CloudinaryService } from 'src/utils/cloudinary.service';
import { UtilsService } from 'src/utils/utils.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) public usersRepository: Repository<User>,
    @InjectRepository(FeedBack) public feedbackRepository: Repository<FeedBack>,
    @InjectRepository(Hobby) private hobbyRepository: Repository<Hobby>,
    private cloudinaryService: CloudinaryService,
    private utilServise: UtilsService,
  ) {}

  async findByEmail(email: string) {
    const user = await this.usersRepository.findOne({
      where: { email: email },
    });
    if (user) return user;
    throw new BadRequestException(`User with email ${email} not found`);
  }

  async findAll() {
    return await this.usersRepository.find({
      relations: ['advert', 'feedbacks'],
    });
  }

  async findOne(id: number) {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: [
        'advert',
        'hobbies',
        'feedbacks',
        'writtenFeedbacks',
        'country',
      ],
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

  async updateUserInfo(
    id: number,
    updateUserDto: UpdateUserDto,
    photo?: Express.Multer.File,
  ) {
    const user = await this.findOne(id);

    user.email = updateUserDto.email ?? user.email;
    user.firstName = updateUserDto.firstName ?? user.firstName;
    user.lastName = updateUserDto.lastName ?? user.lastName;
    user.birthday = updateUserDto.birthday ?? user.birthday;
    user.sex = updateUserDto.sex ?? user.sex;
    user.hobbies = updateUserDto.hobbies
      ? await this.getHobbies(updateUserDto.hobbies)
      : user.hobbies;

    if (updateUserDto.countryName) {
      const countryParse = JSON.parse(updateUserDto.countryName);
      user.country =
        (await this.utilServise.findCountry(countryParse)) ?? user.country;
    }
    // console.log('get in method photo is:' + photo);

    if (photo) {
      // console.log('in if');

      if (user.photoPath) {
        this.cloudinaryService.deleteFile(user.photoPath);
      }
      const res = await this.cloudinaryService.uploadFile(photo);
      // console.log(res);

      user.photoPath = res.url;
      console.log(
        `User with id ${user.id}, upload photo with id ${res.public_id}`,
      );
    }

    return this.usersRepository.save(user);
  }

  async addFeedback(
    userId: number,
    currentUserId: number,
    feedback: CreateFeedback,
  ): Promise<FeedBack> {
    const user = await this.findOne(userId);
    const currentUser = await this.findOne(currentUserId);

    if (user == currentUser) {
      throw new BadRequestException(
        'The user cannot write feedback to himself',
      );
    }

    const newFeedback = this.feedbackRepository.create(feedback);

    user.feedbacks.push(newFeedback);
    currentUser.writtenFeedbacks.push(newFeedback);

    await this.usersRepository.save(user);
    await this.usersRepository.save(currentUser);

    return await this.feedbackRepository.save(newFeedback);
  }

  async getHobbies(hobbies: Hobby[]): Promise<Hobby[]> {
    return Promise.all(
      hobbies.map(async (data) => {
        const hobby = await this.hobbyRepository.findOne({
          where: { hobby: data.hobby },
        });
        return (
          hobby ||
          this.hobbyRepository.save(
            Object.assign(new Hobby(), { hobby: data.hobby }),
          )
        );
      }),
    );
  }
}
