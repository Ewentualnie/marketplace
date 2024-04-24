import {
  ConflictException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { LoginUserDto } from 'src/models/dto/login-user.dto';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/models/dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import { Tokens } from 'src/types/tokens.type';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/models/user.entity';
import { Repository } from 'typeorm';
import { genSalt } from 'bcrypt';
import { UserRes } from 'src/types/user-response';
import { Role } from 'src/utils/role.enum';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    public usersRepository: Repository<User>,
    public jwtService: JwtService,
    private userService: UsersService,
  ) {}

  async signUp(createUserDto: CreateUserDto): Promise<UserRes> {
    try {
      const user = this.usersRepository.create(createUserDto);

      user.hashedPass = await this.hashData(createUserDto.password);

      await this.usersRepository.save(user);

      const tokens = await this.getTokens(user.id, user.email, user.role);
      await this.updateRtHash(user.id, tokens.refreshToken);
      return { user, tokens };
    } catch (error) {
      throw new ConflictException(
        `User with email ${createUserDto.email} already exists`,
      );
    }
  }

  async signIn(loginUserDto: LoginUserDto): Promise<UserRes> {
    const user = await this.userService.findByEmail(loginUserDto.email);

    const resultCompare = await this.compareHash(
      loginUserDto.password,
      user.hashedPass,
    );

    if (!resultCompare) {
      throw new ForbiddenException('Access denied');
    }

    user.lastVisit = new Date();
    await this.usersRepository.save(user);

    const tokens = await this.getTokens(user.id, user.email, user.role);
    await this.updateRtHash(user.id, tokens.refreshToken);
    return { user, tokens };
  }

  async logOut(userId: number) {
    await this.usersRepository.update(userId, { refreshToken: null });
  }

  async refresh(userId: number, rt: string): Promise<UserRes> {
    const user = await this.userService.findOne(userId);

    if (!user.refreshToken || !this.compareHash(rt, user.refreshToken)) {
      throw new ForbiddenException('Access denied');
    }

    const tokens = await this.getTokens(user.id, user.email, user.role);
    await this.updateRtHash(user.id, tokens.refreshToken);
    return { user, tokens };
  }

  async createAdminUser() {
    const admin = await this.usersRepository.findOne({
      where: { email: process.env.ADMIN_USER },
    });

    if (!admin) {
      const adminUser = new User();
      adminUser.email = process.env.ADMIN_USER;
      adminUser.hashedPass = await this.hashData(process.env.ADMIN_PASS);
      adminUser.firstName = 'ADMIN';
      adminUser.role = Role.Admin;

      const admin = await this.usersRepository.save(adminUser);
      const tokens = await this.getTokens(admin.id, admin.email, admin.role);
      await this.updateRtHash(admin.id, tokens.refreshToken);
      console.log('Admin user created');
    }
  }

  async updateRtHash(userId: number, rt: string) {
    const hashRt = await this.hashData(rt);
    await this.usersRepository.update(userId, {
      refreshToken: hashRt,
    });
  }

  async getTokens(
    userId: number,
    email: string,
    role: string,
  ): Promise<Tokens> {
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
          role: role,
        },
        {
          secret: 'at-secret',
          expiresIn: '24h',
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
          role: role,
        },
        {
          secret: 'rt-secret',
          expiresIn: 60 * 60 * 24 * 7,
        },
      ),
    ]);
    return {
      accessToken: at,
      refreshToken: rt,
    };
  }

  async hashData(data: string) {
    const saltRounds = +process.env.SALT_FOR_BCRYPT;
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
