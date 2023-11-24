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
import { Specialization } from 'src/models/specialization.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) public usersRepository: Repository<User>,
    @InjectRepository(FeedBack) public feedbackRepository: Repository<FeedBack>,
    @InjectRepository(Hobby) private hobbyRepository: Repository<Hobby>,
    @InjectRepository(Advert) private advertRepository: Repository<Advert>,
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
        'specializations',
        'feedbacks',
        'feedbacks.fromUsers',
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
    user.hobbies = updateUserDto.hobbies
      ? await this.getHobbies(updateUserDto.hobbies)
      : user.hobbies;

    if (updateUserDto.country) {
      user.country =
        (await this.utilServise.findCountry(updateUserDto.country)) ??
        user.country;
    }

    if (updateUserDto.specializations) {
      user.specializations =
        (await this.getSpecializations(updateUserDto.specializations)) ??
        user.specializations;
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

    if (user == currentUser) {
      throw new BadRequestException(
        'The user cannot write feedback to himself',
      );
    }

    const newFeedback = this.feedbackRepository.create(feedback);

    user.feedbacks.push(newFeedback);
    currentUser.writtenFeedbacks.push(newFeedback);
    currentUser.lastVisit = new Date();

    await this.usersRepository.save(user);
    await this.usersRepository.save(currentUser);

    return await this.feedbackRepository.save(newFeedback);
  }

  async getHobbies(hobbies: string[]): Promise<Hobby[]> {
    return Promise.all(
      hobbies.map(async (val) => {
        const hobby = await this.hobbyRepository.findOne({
          where: { hobby: val },
        });
        return (
          hobby ||
          this.hobbyRepository.save(Object.assign(new Hobby(), { hobby: val }))
        );
      }),
    );
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
}
