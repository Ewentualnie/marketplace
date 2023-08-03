import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { LoginUserDto } from 'src/users/dto/login-user.dto';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import { Tokens } from 'src/types/tokens.type';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { genSalt } from 'bcrypt';
import { UserRes } from 'src/types/user-response';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    public usersRepository: Repository<User>,
    public jwtService: JwtService,
  ) {}

  async signUp(createUserDto: CreateUserDto): Promise<UserRes> {
    try {
      const user = this.usersRepository.create(createUserDto);

      user.hashedPass = await this.hashData(createUserDto.password);

      await this.usersRepository.save(user);

      const tokens = await this.getTokens(user.id, user.email);
      await this.updateRtHash(user.id, tokens.refreshToken);
      return { user, tokens };
    } catch (error) {
      throw new HttpException(
        `User with email ${createUserDto.email} already exists`,
        HttpStatus.CONFLICT,
      );
    }
  }

  async signIn(loginUserDto: LoginUserDto): Promise<UserRes> {
    const user = await this.usersRepository.findOne({
      where: { email: loginUserDto.email },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const resultCompare = await this.compareHash(
      loginUserDto.password,
      user.hashedPass,
    );

    if (!resultCompare) {
      throw new ForbiddenException('Access denied');
    }

    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRtHash(user.id, tokens.refreshToken);
    return { user, tokens };
  }

  async logOut(userId: number) {
    await this.usersRepository.update(userId, { refreshToken: null });
  }

  async refresh(userId: number, rt: string): Promise<UserRes> {
    const user = await this.usersRepository.findOneBy({ id: userId });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!this.compareHash(rt, user.refreshToken) || !user.refreshToken) {
      throw new ForbiddenException('Access denied');
    }

    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRtHash(user.id, tokens.refreshToken);
    return { user, tokens };
  }

  async updateRtHash(userId: number, rt: string) {
    const hashRt = await this.hashData(rt);
    await this.usersRepository.update(userId, {
      refreshToken: hashRt,
    });
  }

  async getTokens(userId: number, email: string): Promise<Tokens> {
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: 'at-secret',
          expiresIn: 60 * 15,
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: 'rt-secret',
          expiresIn: 60 * 60 * 24 * 7,
        },
      ),
    ]);
    return {
      accesToken: at,
      refreshToken: rt,
    };
  }

  async hashData(data: string) {
    const saltRounds = +process.env.SALT_FOR_BCRYPT || 10;
    const salt = await genSalt(saltRounds);
    return await bcrypt.hash(data, salt);
  }

  compareHash(password: string, hashDataPass: string) {
    return bcrypt.compare(password, hashDataPass);
  }

  generateAccessToken(user: User): string {
    const payload = { sub: user.id, email: user.email };
    return this.jwtService.sign(payload);
  }
}
