import {
  BadRequestException,
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAdvertDto } from './dto/create-advert.dto';
import { UpdateAdvertDto } from './dto/update-advert.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Advert } from './entities/advert.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/entities/user.entity';
import { Language } from './entities/language.entity';

@Injectable()
export class AdvertService {
  constructor(
    @InjectRepository(Advert) private advertRepository: Repository<Advert>,
    @InjectRepository(Language)
    private languageRepository: Repository<Language>,
    private userService: UsersService,
    public jwtService: JwtService,
  ) {}

  async create(createAdvertDto: CreateAdvertDto, userId: number) {
    const user = await this.getCurrentUser(userId);

    if (user.advert != null) {
      throw new ConflictException(`User cannot have more then one advert.`);
    }
    try {
      const newAdvert = this.advertRepository.create(createAdvertDto);
      newAdvert.user = user;
      newAdvert.spokenLanguages = await this.getLanguages(
        createAdvertDto.spokenLanguages,
      );
      newAdvert.teachingLanguages = await this.getLanguages(
        createAdvertDto.teachingLanguages,
      );

      const savedAdvert = await this.advertRepository.save(newAdvert);
      this.userService.updateAdvert(user.id, newAdvert);
      return savedAdvert;
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findAllowedAdverts(query: any) {
    return await this.advertRepository.find({
      relations: ['user', 'hobbies', 'spokenLanguages', 'teachingLanguages'],
      where: { isDeleted: false },
      // order,
    });
  }

  async findAllAdverts() {
    return await this.advertRepository.find({
      relations: ['user', 'spokenLanguages', 'teachingLanguages'],
    });
  }

  async findOne(id: number) {
    const advert = (
      await this.advertRepository.find({
        where: { id },
        relations: ['user', 'spokenLanguages', 'teachingLanguages'],
        take: 1,
      })
    )[0];

    if (!advert) {
      throw new NotFoundException('Advert not found');
    }
    return advert;
  }

  async update(id: number, updateAdvertDto: UpdateAdvertDto, userId: number) {
    // return await this.advertRepository.update(id, updateAdvertDto);
    return 'not implement yet';
  }

  async removeOwnAdvert(userId: number) {
    const user = await this.getCurrentUser(userId);
    if (user.advert == null) {
      throw new BadRequestException(`User with ID ${user.id} has no advert`);
    }
    return await this.softDeleteAdvert(user.advert.id);
  }

  async restoreOwnAdvert(userId: number) {
    const user = await this.getCurrentUser(userId);
    if (user.advert == null) {
      throw new BadRequestException(`User with ID ${user.id} has no advert`);
    }
    return await this.restoreAdvert(user.advert.id);
  }

  async softDeleteAdvert(id: number) {
    return await this.advertRepository.update(id, {
      isDeleted: true,
    });
  }

  async restoreAdvert(id: number) {
    return await this.advertRepository.update(id, {
      isDeleted: false,
    });
  }

  async getLanguages(languages: Language[]): Promise<Language[]> {
    return Promise.all(
      languages.map(async (data) => {
        const lang = await this.languageRepository.findOne({
          where: { language: data.language },
        });
        return (
          lang ||
          this.languageRepository.save(
            Object.assign(new Language(), { language: data.language }),
          )
        );
      }),
    );
  }

  async getCurrentUser(id: number): Promise<User> {
    return await this.userService.findOne(id);
  }
}
