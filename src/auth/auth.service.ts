import {
  BadRequestException,
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

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    public usersRepository: Repository<User>,
    public jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async signUp(createUserDto: CreateUserDto): Promise<Tokens> {
    try {
      const newUser = this.usersRepository.create(createUserDto);

      const tokens = await this.getTokens(newUser.id, newUser.email);

      newUser.hashedPass = await this.hashData(createUserDto.password);

      await this.usersRepository.save(newUser);

      await this.updateRtHash(newUser.id, tokens.refreshToken);

      return tokens;
    } catch (error) {
      throw new HttpException(
        `User with email ${createUserDto.email} already exists`,
        HttpStatus.CONFLICT,
      );
    }
  }

  async signIn(loginUserDto: LoginUserDto): Promise<Tokens> {
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
    return tokens;
  }

  async logOut(userId: number) {
    await this.usersRepository.update(userId, { refreshToken: null });
  }

  async refresh(userId: number, rt: string) {
    const user = await this.usersRepository.findOneBy({ id: userId });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!this.compareHash(rt, user.refreshToken)) {
      throw new ForbiddenException('Access denied');
    }

    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRtHash(user.id, tokens.refreshToken);
    return tokens;
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

  hashData(data: string) {
    return bcrypt.hash(data, process.env.SALT_FOR_BCRYPT || 10);
  }

  compareHash(password: string, hashDataPass: string) {
    return bcrypt.compare(password, hashDataPass);
  }

  generateAccessToken(user: User): string {
    const payload = { sub: user.id, email: user.email };
    return this.jwtService.sign(payload);
  }
}
