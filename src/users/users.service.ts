import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CloudinaryService } from 'src/utils/cloudinary.service';
import { UtilsService } from 'src/utils/utils.service';
import { Order, Flags } from 'src/types/usersFilterAndSort.type';
import UpdateUserDto from '../models/dto/update-user.dto';
import CreateFeedback from '../models/dto/add-feedback.dto';
import FeedBack from '../models/feedback.entity';
import Advert from 'src/models/advert.entity';
import User from '../models/user.entity';
import UpdateUserEmailDto from 'src/models/dto/updateUserEmail.dto';
import UpdateUserPasswordDto from 'src/models/dto/updateUserPassword.dto';
import UserRes from 'src/types/user-response';
import Chat from 'src/models/chat.entity';
import Message from 'src/models/message.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) public usersRepository: Repository<User>,
    @InjectRepository(FeedBack) public feedbackRepository: Repository<FeedBack>,
    @InjectRepository(Advert) private advertRepository: Repository<Advert>,
    @InjectRepository(Chat) private chatRepository: Repository<Chat>,
    @InjectRepository(Message) private messageRepository: Repository<Message>,
    private cloudinaryService: CloudinaryService,
    private utilServise: UtilsService,
  ) {}

  async findByEmail(email: string) {
    const user = await this.usersRepository.findOne({
      where: { email: email },
      relations: [
        'advert',
        'feedbacksToMe',
        'feedbacksFromMe',
        'country',
        'likes.advert',
      ],
    });
    if (user) return user;
    throw new BadRequestException(`User with email ${email} not found`);
  }

  async findAll(sort?: Order, filter?: Flags, limit = 10, page = 0) {
    const query = this.usersRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.advert', 'advert')
      .leftJoinAndSelect('user.feedbacksToMe', 'feedbacksToMe')
      .leftJoinAndSelect('user.feedbacksFromMe', 'feedbacksFromMe')
      .leftJoinAndSelect('user.country', 'country');

    if (filter) {
      if (filter.photoPath) {
        query.andWhere('user.photoPath IS NOT NULL');
      }
      if (filter.advert) {
        query.andWhere('user.advert IS NOT NULL');
      }
      if (filter.countryId) {
        query.andWhere('user.countryId = :countryId', {
          countryId: filter.countryId,
        });
      }
    }

    if (sort) {
      Object.keys(sort).forEach((key) => {
        query.addOrderBy(`user.${key}`, sort[key] as 'ASC' | 'DESC');
      });
    }

    const validLimit = isNaN(limit) || limit <= 0 ? 10 : limit;
    const validPage = isNaN(page) || page < 0 ? 0 : page;

    const skip = validPage * validLimit;
    const totalRecords = await query.getCount();
    const totalPages = Math.ceil(totalRecords / validLimit);

    if (validPage >= totalPages) {
      throw new Error(`Requested page ${validPage} does not exist`);
    }

    query.skip(skip).take(validLimit);
    return await query.getMany();
  }

  async findOne(id: number) {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: [
        'advert',
        'feedbacksToMe',
        'feedbacksFromMe',
        'country',
        'likes.advert',
      ],
    });
    if (user) return user;
    throw new BadRequestException(`User with id ${id} not found`);
  }

  async getUserById(id: number) {
    const user = await this.usersRepository.findOne({
      where: { id },
    });
    if (user) return user;
    throw new BadRequestException(`User with id ${id} not found`);
  }

  async getTeacherById(id: number) {
    const teacher = await this.usersRepository.findOne({
      where: { id },
      relations: ['advert', 'bookingsAsTeacher'],
    });
    if (!teacher) {
      throw new BadRequestException(`User with id ${id} is not found`);
    }
    if (!teacher.advert) {
      throw new BadRequestException(
        `Only user with advert can claim timeslots`,
      );
    }
    return teacher;
  }

  async getStudentById(id: number): Promise<User> {
    const student = await this.usersRepository.findOne({
      where: { id },
      relations: ['bookingsAsStudent'],
    });
    if (!student) {
      throw new BadRequestException(`User with id ${id} is not found`);
    }
    return student;
  }

  async getUserWithLikes(id: number) {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['likes'],
    });
    if (user) return user;
    throw new BadRequestException(`User with id ${id} not found`);
  }

  async getLikes(id: number) {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['likes', 'likes.advert'],
    });
    if (user) return user.likes;
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

    return await this.usersRepository.save(user);
  }

  async updateUserPhoto(id: number, photo: Express.Multer.File) {
    const user = await this.findOne(id);

    if (user.photoPath) {
      this.cloudinaryService.deleteFile(user.photoPath);
    }

    const res = await this.cloudinaryService.uploadFile(photo);
    user.photoPath = res.url;
    console.log(
      `User with id ${user.id}, upload photo with public_id: ${res.public_id}`,
    );

    return await this.usersRepository.save(user);
  }

  async updateEmail(
    id: number,
    updateUserEmailDto: UpdateUserEmailDto,
  ): Promise<User> {
    const user = await this.findOne(id);
    const checkEmail = await this.usersRepository.findOne({
      where: { email: updateUserEmailDto.email },
    });

    if (checkEmail) {
      throw new BadRequestException('New email already exists');
    } else {
      user.email = await updateUserEmailDto.email;
      user.lastVisit = new Date();
      return await this.usersRepository.save(user);
    }
  }

  async updatePassword(
    id: number,
    updateUserPasswordDto: UpdateUserPasswordDto,
  ): Promise<UserRes> {
    const user = await this.findOne(id);

    const resultCompare = await this.utilServise.compareHash(
      updateUserPasswordDto.oldPassword,
      user.hashedPass,
    );

    if (!resultCompare) {
      throw new ForbiddenException('Current password is incorrect');
    }

    const newHashedPass = await this.utilServise.hashData(
      updateUserPasswordDto.newPassword,
    );

    const passwordCompare = await this.utilServise.compareHash(
      updateUserPasswordDto.newPassword,
      user.hashedPass,
    );

    if (passwordCompare) {
      throw new BadRequestException(
        'The the new password must be different from the old',
      );
    } else {
      user.hashedPass = newHashedPass;
    }

    const tokens = await this.utilServise.getTokens(
      user.id,
      user.email,
      user.role,
    );
    await this.utilServise.updateRtHash(user.id, tokens.refreshToken);
    user.lastVisit = new Date();
    await this.usersRepository.save(user);
    return { user, tokens };
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

  async saveUser(user: User) {
    return await this.usersRepository.save(user);
  }

  async createTestUsers(count: number) {
    const testUsers = await this.usersRepository.find({
      where: { firstName: Like('testUser_%') },
    });
    let lastTestUserNum = 0;
    if (testUsers.length > 0) {
      lastTestUserNum =
        Math.max(
          ...testUsers
            .map((user) => user.firstName)
            .map((name) => +name.split('_')[1]),
        ) + 1;
    }
    for (let i = 0; i < count; i++, lastTestUserNum++) {
      const testUser = new User();
      testUser.email = `user${lastTestUserNum}@gmail.com`;
      testUser.firstName = `testUser_${lastTestUserNum}`;
      testUser.hashedPass = await this.utilServise.hashData('TestUserPassw0rd');
      testUser.country = await this.utilServise.findCountry(2);

      let advert = new Advert();
      advert.createdAt = new Date();
      advert.description = `It is test advert of user ${testUser.firstName}`;
      advert.imagePath =
        'https://res.cloudinary.com/dbccoiwll/image/upload/v1719060371/kgxh8tx2lg1gcg3vetnb.jpg';
      advert.price = 111;
      advert.teachingLanguages = await this.getLangs('[1,2]');
      advert.spokenLanguages = await this.getLangs('[1,2,3]');

      testUser.advert = advert;
      await this.usersRepository.save(testUser);

      advert.user = testUser;
      advert = await this.advertRepository.save(advert);
      testUser.advert = advert;
      await this.usersRepository.save(testUser);
    }
    return `Added ${count} users, last user has number ${lastTestUserNum - 1}`;
  }

  async getUserWithChats(id: number) {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['chatsAsUser1', 'chatsAsUser2'],
    });
    if (user) return user;
    throw new BadRequestException(`User with id ${id} not found`);
  }

  async getLangs(languages: string) {
    const res = (
      await Promise.all(
        JSON.parse(languages).map(
          async (id: number) => await this.utilServise.findLanguage(id),
        ),
      )
    ).filter((val) => val != null);
    if (res.length == 0) {
      throw new BadRequestException('You must add correct languages!');
    }
    return res;
  }
}
