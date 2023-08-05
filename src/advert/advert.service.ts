import {
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

@Injectable()
export class AdvertService {
  constructor(
    @InjectRepository(Advert) private advertRepository: Repository<Advert>,
    @InjectRepository(Hobby) private hobbyRepository: Repository<Hobby>,
    private userService: UsersService,
  ) {}

  async create(userId: number, createAdvertDto: CreateAdvertDto) {
    const user = await this.userService.findOne(userId);

    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }
    if (user.advert != null) {
      throw new ConflictException(`User cannot have more then one advert.`);
    }

    const newAdvert = this.advertRepository.create(createAdvertDto);
    newAdvert.user = user;
    const savedAdvert = await this.advertRepository.save(newAdvert);
    this.userService.updateAdvert(user.id, newAdvert);

    return savedAdvert;
  }

  findAll() {
    return this.advertRepository.find({ relations: ['user'] });
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
}
