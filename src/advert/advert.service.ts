import { Injectable } from '@nestjs/common';
import { CreateAdvertDto } from './dto/create-advert.dto';
import { UpdateAdvertDto } from './dto/update-advert.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Advert } from './entities/advert.entity';
import { Repository } from 'typeorm';
import { Hobby } from './entities/hobby.entity';

@Injectable()
export class AdvertService {
  constructor(
    @InjectRepository(Advert) private advertRepository: Repository<Advert>,
    @InjectRepository(Hobby) private hobbyRepository: Repository<Hobby>,
  ) {}

  async create(userId: number, createAdvertDto: CreateAdvertDto) {
    // const advert = await this.advertRepository.findOneBy({
    //   user: { where: { id: userId } },
    // });
    const newAdvert = this.advertRepository.create(createAdvertDto);
    const savedAdvert = await this.advertRepository.save(newAdvert);
    return this.advertRepository.create(createAdvertDto);
  }

  findAll() {
    return this.advertRepository.find();
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
