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
import { Repository } from 'typeorm';
import { Hobby } from './entities/hobby.entity';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AdvertService {
  constructor(
    @InjectRepository(Advert) private advertRepository: Repository<Advert>,
    @InjectRepository(Hobby) private hobbyRepository: Repository<Hobby>,
    private userService: UsersService,
    public jwtService: JwtService,
  ) {}

  async create(createAdvertDto: CreateAdvertDto, accesToken: string) {
    try {
      const user = await this.getUserFromToken(accesToken);
      if (user.advert != null) {
        throw new ConflictException(`User cannot have more then one advert.`);
      }
      const newAdvert = this.advertRepository.create(createAdvertDto);
      newAdvert.user = user;

      const hobbies: Hobby[] = [];
      for (const hobbyData of createAdvertDto.hobbies) {
        let hobby = await this.hobbyRepository.findOne({
          where: { hobby: hobbyData.hobby },
        });
        if (!hobby) {
          hobby = new Hobby();
          hobby.hobby = hobbyData.hobby;
          await this.hobbyRepository.save(hobby);
        }
        hobbies.push(hobby);
      }
      newAdvert.hobbies = hobbies;

      const savedAdvert = await this.advertRepository.save(newAdvert);
      this.userService.updateAdvert(user.id, newAdvert);
      return savedAdvert;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  findAll() {
    return this.advertRepository.find({ relations: ['user', 'hobbies'] });
  }

  findOne(id: number) {
    return this.advertRepository.findOneBy({ id: id });
  }

  update(id: number, updateAdvertDto: UpdateAdvertDto) {
    return this.advertRepository.update(id, updateAdvertDto);
  }

  remove(id: number) {
    return this.advertRepository.delete(id);
  }

  async getUserFromToken(accesToken: string): Promise<User> {
    const jwt = accesToken.replace('Bearer', '').trim();
    const userId = this.jwtService.decode(jwt).sub;
    const user = await this.userService.findOne(userId);

    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    return user;
  }
}
