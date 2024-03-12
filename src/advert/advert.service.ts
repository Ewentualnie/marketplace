import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAdvertDto } from '../models/dto/create-advert.dto';
import { UpdateAdvertDto } from '../models/dto/update-advert.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Advert } from 'src/models/advert.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/models/user.entity';
import { Language } from 'src/models/language.entity';
import { Role } from 'src/utils/role.enum';
import { CloudinaryService } from 'src/utils/cloudinary.service';
import { UtilsService } from 'src/utils/utils.service';
import { Specialization } from 'src/models/specialization.entity';
import { AdvertLike } from 'src/models/advertLike.entity';

@Injectable()
export class AdvertService {
  constructor(
    @InjectRepository(Advert) private advertRepository: Repository<Advert>,
    @InjectRepository(User) private usersRepository: Repository<User>,
    @InjectRepository(AdvertLike)
    private readonly advertLikeRepository: Repository<AdvertLike>,
    @InjectRepository(Language)
    private languageRepository: Repository<Language>,
    private userService: UsersService,
    public jwtService: JwtService,
    public cloudinaryService: CloudinaryService,
    public utilServise: UtilsService,
  ) {}

  async create(
    advertDTO: CreateAdvertDto,
    userId: number,
    file: Express.Multer.File,
  ) {
    const userParse = JSON.parse(advertDTO.updateUser);
    const user = await this.userService.updateUserInfo(userId, userParse);

    if (
      user.firstName == null ||
      user.lastName == null ||
      user.sex == null ||
      user.country == null ||
      user.birthday == null
    ) {
      const array: string[] = [];
      if (!user.firstName) {
        array.push('firstName');
      }
      if (!user.lastName) {
        array.push('lastName');
      }
      if (!user.sex) {
        array.push('sex');
      }
      if (!user.country) {
        array.push('country');
      }
      if (!user.birthday) {
        array.push('birthday');
      }
      throw new BadRequestException(
        `You need to fill in the following fields: ${array.join()}`,
      );
    }
    if (user.advert != null) {
      throw new ConflictException(`User cannot have more then one advert.`);
    }
    if (!file) {
      throw new BadRequestException('You must add an image to your advert');
    }

    const { url } = await this.cloudinaryService.uploadFile(file);

    const advert = new Advert();
    advert.description = advertDTO.description;
    advert.price = advertDTO.price;
    advert.spokenLanguages = await this.getLangs(advertDTO.spokenLanguages);
    advert.teachingLanguages = await this.getLangs(advertDTO.teachingLanguages);
    advert.specializations = await this.getSpecs(advertDTO.specializations);
    advert.user = user;
    advert.imagePath = url;

    const savedAdvert = await this.advertRepository.save(advert);
    this.userService.updateAdvert(user.id, advert);

    return savedAdvert;
  }

  async findAllowedAdverts(query: Record<string, string>) {
    const queryParams = this.convertQueryParams(query);
    const queryBuilder = this.advertRepository.createQueryBuilder('advert');

    if (queryParams.country) {
      queryBuilder.andWhere('user.country = :id', {
        id: queryParams.country,
      });
    }
    if (queryParams.language) {
      queryBuilder.andWhere('teachingLanguage.id = :id', {
        id: queryParams.language,
      });
    }
    if (queryParams.specialization) {
      queryBuilder.andWhere('specialization.id = :id', {
        id: queryParams.specialization,
      });
    }

    const adverts = await queryBuilder
      .distinctOn(['advert.id'])
      .groupBy(
        'advert.id, advert.price, advert.description,' +
          ' advert.imagePath, advert.createdAt, advert.isDeleted,' +
          ' user.country, user.email, user.firstName, user.lastName,' +
          ' teachingLanguage.id, specialization.id, user.id, likes.id',
      )
      .addSelect('COUNT(likes.id)', 'likesCount')
      .addSelect(['advert.id as advert_id'])
      .leftJoinAndSelect('advert.teachingLanguages', 'teachingLanguage')
      .leftJoinAndSelect('advert.specializations', 'specialization')
      .leftJoinAndSelect('advert.likes', 'likes')
      .leftJoinAndSelect('advert.user', 'user')
      .getRawMany();

    const totalCount = adverts.length;
    const limit =
      queryParams.limit && queryParams.limit > 0 ? queryParams.limit : 9;
    const totalPages = Math.ceil(totalCount / limit);
    const page = Math.min(
      queryParams.page && queryParams.page > 0 ? queryParams.page : 1,
      totalPages,
    );

    const paginatedAdverts = await this.paginateAdverts(adverts, page, limit);

    return {
      adverts: paginatedAdverts,
      prev: page > 1,
      next: page < totalPages,
      totalPages,
      currentPage: page,
    };
  }

  async findAllAdverts() {
    return await this.advertRepository.find({
      relations: [
        'user',
        'spokenLanguages',
        'teachingLanguages',
        'specializations',
        'user.country',
        'user.feedbacksToMe',
        'user.feedbacksFromMe',
        'user.feedbacksToMe.toUser',
        'user.feedbacksToMe.fromUser',
        'user.feedbacksFromMe.toUser',
        'user.feedbacksFromMe.fromUser',
      ],
    });
  }

  async findOne(id: number) {
    const advert = await this.advertRepository.findOne({
      where: { id },
      relations: [
        'user',
        'spokenLanguages',
        'teachingLanguages',
        'specializations',
        'likes',
        'user.country',
        'user.feedbacksToMe',
        'user.feedbacksToMe.fromUser',
      ],
    });

    if (!advert) {
      throw new NotFoundException(`Advert with id "${id}" not found`);
    }
    return advert;
  }

  async updateAdvertInfo(
    id: number,
    updateAdvertDto: UpdateAdvertDto,
    userId: number,
    file?: Express.Multer.File,
  ) {
    const advert = await this.findOne(id);
    const user = await this.userService.findOne(userId);

    if (user.advert.id == advert.id || user.role == Role.Admin) {
      advert.price = updateAdvertDto.price ?? advert.price;
      advert.description = updateAdvertDto.description ?? advert.description;
      advert.spokenLanguages = updateAdvertDto.spokenLanguages
        ? await this.getLangs(updateAdvertDto.spokenLanguages)
        : advert.spokenLanguages;
      advert.teachingLanguages = updateAdvertDto.teachingLanguages
        ? await this.getLangs(updateAdvertDto.teachingLanguages)
        : advert.teachingLanguages;

      if (file) {
        if (advert.imagePath) {
          this.cloudinaryService.deleteFile(advert.imagePath);
        }
        advert.imagePath = (await this.cloudinaryService.uploadFile(file)).url;
      }

      return this.advertRepository.save(advert);
    }
  }

  async deleteRestoreOwnAdvert(userId: number) {
    const user = await this.getCurrentUser(userId);
    if (user.advert == null) {
      throw new BadRequestException(`User with ID ${user.id} has no advert`);
    }
    return await this.deleteRestoreAdvert(user.advert.id);
  }

  async deleteRestoreAdvert(id: number) {
    const advert = await this.findOne(id);
    advert.isDeleted = !advert.isDeleted;
    return this.advertRepository.save(advert);
  }

  async toFavorite(userId: number, advertId: number) {
    const user = await this.userService.getUserWithLikes(userId);
    const advert = await this.findOne(advertId);

    const likeRecord = await this.advertLikeRepository.findOne({
      where: { user: { id: user.id }, advert: { id: advert.id } },
    });

    if (likeRecord) {
      return await this.advertLikeRepository.remove(likeRecord);
    } else {
      const newLike = this.advertLikeRepository.create({ user, advert });
      user.likes.push(newLike);
      return await this.advertLikeRepository.save(newLike);
    }
  }

  async getLanguages(languages: Language[]): Promise<Language[]> {
    return Promise.all(
      languages.map(async (data) => {
        return await this.languageRepository.findOne({
          where: {
            alpha2: data.alpha2,
            languageEn: data.languageEn,
            languageUa: data.languageUa,
          },
        });
      }),
    );
  }

  async getLangs(languages: string): Promise<Language[]> {
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

  async getSpecs(specializations: string): Promise<Specialization[]> {
    const res = (
      await Promise.all(
        JSON.parse(specializations).map(
          async (id: number) => await this.utilServise.findSpecialization(id),
        ),
      )
    ).filter((val) => val != null);
    if (res.length == 0) {
      throw new BadRequestException('You must add correct specializations!');
    }
    return res;
  }

  async getCurrentUser(id: number): Promise<User> {
    return await this.userService.findOne(id);
  }

  convertQueryParams(query: Record<string, string>) {
    const allowedKeys = [
      'language',
      'country',
      'specialization',
      'price',
      'page',
      'limit',
    ];

    const params: Record<string, number> = {};

    for (const key of allowedKeys) {
      const stringValue = query[key];
      if (stringValue !== undefined) {
        const numericValue = parseInt(stringValue, 10);
        if (!isNaN(numericValue) && numericValue > 0) {
          params[key] = numericValue;
        }
      }
    }

    return params;
  }

  async paginateAdverts(adverts: any[], page: number, limit: number) {
    const filteredAdverts = await Promise.all(
      adverts
        .map((val) => val.advert_id)
        .map((id) =>
          this.advertRepository.findOne({
            where: { id },
            relations: [
              'user',
              'teachingLanguages',
              'specializations',
              'user.country',
              'likes',
            ],
          }),
        ),
    );
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedArray = filteredAdverts.slice(startIndex, endIndex);

    return paginatedArray;
  }
}
