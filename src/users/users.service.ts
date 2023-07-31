import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    public usersRepository: Repository<User>,
  ) {}

  findByEmail(email: string) {
    const user = this.usersRepository.findOne({
      where: { email: email },
    });
    if (user) return user;
    throw new HttpException(
      `User with this email not found`,
      HttpStatus.BAD_REQUEST,
    );
  }

  findAll() {
    return this.usersRepository.find({ relations: ['advert'] });
  }

  findOne(id: number) {
    return this.usersRepository.findOneBy({ id: id });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.usersRepository.update(id, updateUserDto);
  }

  remove(id: number) {
    return this.usersRepository.delete(id);
  }
}
