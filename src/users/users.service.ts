import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Advert } from 'src/advert/entities/advert.entity';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    public usersRepository: Repository<User>,
  ) {}

  async findByEmail(email: string) {
    const user = await this.usersRepository.findOne({
      where: { email: email },
    });
    if (user) return user;
    throw new BadRequestException(`User with email ${email} not found`);
  }

  async findAll() {
    return await this.usersRepository.find({ relations: ['advert'] });
  }

  async findOne(id: number) {
    return await this.usersRepository.findOne({
      where: { id },
      relations: ['advert'],
    });
  }

  async updateAdvert(id: number, advert: Advert) {
    return await this.usersRepository.update(id, { advert: advert });
  }

  async softUserDelete(id: number) {
    return await this.usersRepository.update(id, { isDeleted: true });
  }

  async hardUserDelete(id: number) {
    return await this.usersRepository.remove((await this.findOne(id))[0]);
  }

  async updateUserInfo(id: number, updateUserDto: UpdateUserDto) {
    return 'not implemented yet';
  }
}
