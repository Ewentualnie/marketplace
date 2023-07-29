import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    public usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { password, ...rest } = createUserDto;
    const cryptedPass = await bcrypt.hash(
      password,
      process.env.SALT_FOR_BCRYPT || 10,
    );
    const userToSave = { ...rest, password: cryptedPass };
    try {
      return await this.usersRepository.save(userToSave);
    } catch (error) {
      throw new HttpException(
        `User with email ${createUserDto.email} already exists`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

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
    return this.usersRepository.find();
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
