import { Injectable } from '@nestjs/common';
import { CreateAdvertDto } from './dto/create-advert.dto';
import { UpdateAdvertDto } from './dto/update-advert.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Advert } from './entities/advert.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AdvertService {
  constructor(
    @InjectRepository(Advert) private advertRepository: Repository<Advert>,
  ) {}
  create(createAdvertDto: CreateAdvertDto) {
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
