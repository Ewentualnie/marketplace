import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAdvertDto } from './dto/create-advert.dto';
import { UpdateAdvertDto } from './dto/update-advert.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Advert } from './entities/advert.entity';
import {
  Connection,
  EntityMetadata,
  Repository,
  getConnection,
  getMetadataArgsStorage,
} from 'typeorm';
import { Hobby } from './entities/hobby.entity';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/entities/user.entity';
import { Language } from './entities/language.entity';

@Injectable()
export class AdvertService {
  constructor(
    @InjectRepository(Advert) private advertRepository: Repository<Advert>,
    @InjectRepository(Hobby) private hobbyRepository: Repository<Hobby>,
    @InjectRepository(Language)
    private languageRepository: Repository<Language>,
    private userService: UsersService,
    public jwtService: JwtService,
    private connection: Connection,
  ) {}

  async create(createAdvertDto: CreateAdvertDto, accesToken: string) {
    const user = await this.getUserFromToken(accesToken);

    if (user.advert != null) {
      throw new ConflictException(`User cannot have more then one advert.`);
    }

    const newAdvert = this.advertRepository.create(createAdvertDto);

    newAdvert.user = user;
    newAdvert.hobbies = await this.getHobbies(createAdvertDto.hobbies);
    newAdvert.spokenLanguages = await this.getLanguages(
      createAdvertDto.spokenLanguages,
    );
    newAdvert.teachingLanguages = await this.getLanguages(
      createAdvertDto.teachingLanguages,
    );

    const savedAdvert = await this.advertRepository.save(newAdvert);
    this.userService.updateAdvert(user.id, newAdvert);
    return savedAdvert;
  }

  findAll(query: any) {
    // const { sort } = query;
    // const sortFields = [];

    // if (sort) {
    //   sort.split(',').forEach((item) => {
    //     const [sortBy, sortDirection] = item.split(':');
    //     sortFields.push({ [sortBy]: sortDirection });
    //   });
    // }

    // const order = {};

    // for (const sortField of sortFields) {
    //   const sortBy = Object.keys(sortField)[0];
    //   const sortDirection = sortField[sortBy];
    //   order[sortBy] = sortDirection as 'ASC' | 'DESC';
    // }

    // Object.keys(order).forEach(async (val) => {
    //   const res = await this.isOrderValid(val);
    //   console.log(res);
    //   if (!res) {
    //     throw new BadRequestException(
    //       `sort parameter ${val} does not exist in the advert database`,
    //     );
    //   }
    // });

    return this.advertRepository.find({
      relations: ['user', 'hobbies', 'spokenLanguages', 'teachingLanguages'],
      // order,
    });
  }

  async findOne(id: number) {
    const advert = (
      await this.advertRepository.find({
        where: { id },
        relations: ['user', 'hobbies', 'spokenLanguages', 'teachingLanguages'],
        take: 1,
      })
    )[0];

    if (!advert) {
      throw new NotFoundException('Page not found');
    }
    return advert;
  }

  update(id: number, updateAdvertDto: UpdateAdvertDto, user: User) {
    return this.advertRepository.update(id, updateAdvertDto);
  }

  remove(id: number, user: User) {
    return this.advertRepository.delete(id);
  }

  async getUserFromToken(accessToken: string): Promise<User> {
    const jwt = accessToken.replace('Bearer', '').trim();
    const userId = this.jwtService.decode(jwt).sub;
    const user = await this.userService.findOne(userId);

    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    return user;
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

  async isOrderValid(order: string): Promise<boolean> {
    const entityMetadata = this.connection.getMetadata(Advert);
    const columnNames = entityMetadata.columns.map(
      (column) => column.databaseName,
    );
    return columnNames.includes(order);
  }
}
