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

@Injectable()
export class AdvertService {
  constructor(
    @InjectRepository(Advert) private advertRepository: Repository<Advert>,
    @InjectRepository(Language)
    private languageRepository: Repository<Language>,
    private userService: UsersService,
    public jwtService: JwtService,
    public cloudinaryService: CloudinaryService,
    public utilServise: UtilsService,
  ) {}

  async create(
    createAdvertDto: CreateAdvertDto,
    userId: number,
    file: Express.Multer.File,
  ) {
    const user = await this.getCurrentUser(userId);

    if (user.advert != null) {
      throw new ConflictException(`User cannot have more then one advert.`);
    }
    if (!file) {
      throw new BadRequestException('You must add an image to your advert');
    }

    const { url } = await this.cloudinaryService.uploadFile(file);

    const advert = new Advert();
    advert.description = createAdvertDto.description;
    advert.price = createAdvertDto.price;
    advert.spokenLanguages = await this.getLangs(
      createAdvertDto.spokenLanguages,
    );
    advert.teachingLanguages = await this.getLangs(
      createAdvertDto.teachingLanguages,
    );
    advert.user = user;
    advert.imagePath = url;

    const savedAdvert = await this.advertRepository.save(advert);
    this.userService.updateAdvert(user.id, advert);

    return savedAdvert;
  }

  async findAllowedAdverts(query: any) {
    return await this.advertRepository.find({
      relations: ['user', 'spokenLanguages', 'teachingLanguages'],
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
        ? await this.getLanguages(updateAdvertDto.spokenLanguages)
        : advert.spokenLanguages;
      advert.teachingLanguages = updateAdvertDto.teachingLanguages
        ? await this.getLanguages(updateAdvertDto.teachingLanguages)
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
        return await this.languageRepository.findOne({
          where: { languageEn: data.languageEn, languageUa: data.languageUa },
        });
      }),
    );
  }

  async getLangs(languages: string): Promise<Language[]> {
    return Promise.all(
      JSON.parse(languages).map(
        async (id: number) => await this.utilServise.findLanguage(id),
      ),
    );
  }

  async getCurrentUser(id: number): Promise<User> {
    return await this.userService.findOne(id);
  }
}
