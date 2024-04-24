import {
  ConflictException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { LoginUserDto } from 'src/models/dto/login-user.dto';
import { CreateUserDto } from 'src/models/dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/models/user.entity';
import { Repository } from 'typeorm';
import { UserRes } from 'src/types/user-response';
import { Role } from 'src/utils/role.enum';
import { UsersService } from 'src/users/users.service';
import { UtilsService } from 'src/utils/utils.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    public usersRepository: Repository<User>,
    public jwtService: JwtService,
    private userService: UsersService,
    private utilServise: UtilsService,
  ) {}

  async signUp(createUserDto: CreateUserDto): Promise<UserRes> {
    try {
      const user = this.usersRepository.create(createUserDto);

      user.hashedPass = await this.utilServise.hashData(createUserDto.password);

      await this.usersRepository.save(user);

      const tokens = await this.utilServise.getTokens(
        user.id,
        user.email,
        user.role,
      );
      await this.utilServise.updateRtHash(user.id, tokens.refreshToken);
      return { user, tokens };
    } catch (error) {
      throw new ConflictException(
        `User with email ${createUserDto.email} already exists`,
      );
    }
  }

  async signIn(loginUserDto: LoginUserDto): Promise<UserRes> {
    const user = await this.userService.findByEmail(loginUserDto.email);

    const resultCompare = await this.utilServise.compareHash(
      loginUserDto.password,
      user.hashedPass,
    );

    if (!resultCompare) {
      throw new ForbiddenException('Access denied');
    }

    user.lastVisit = new Date();
    await this.usersRepository.save(user);

    const tokens = await this.utilServise.getTokens(
      user.id,
      user.email,
      user.role,
    );
    await this.utilServise.updateRtHash(user.id, tokens.refreshToken);
    return { user, tokens };
  }

  async logOut(userId: number) {
    await this.usersRepository.update(userId, { refreshToken: null });
  }

  async refresh(userId: number, rt: string): Promise<UserRes> {
    const user = await this.userService.findOne(userId);

    if (
      !user.refreshToken ||
      !this.utilServise.compareHash(rt, user.refreshToken)
    ) {
      throw new ForbiddenException('Access denied');
    }

    const tokens = await this.utilServise.getTokens(
      user.id,
      user.email,
      user.role,
    );
    await this.utilServise.updateRtHash(user.id, tokens.refreshToken);
    return { user, tokens };
  }

  async createAdminUser() {
    const admin = await this.usersRepository.findOne({
      where: { email: process.env.ADMIN_USER },
    });

    if (!admin) {
      const adminUser = new User();
      adminUser.email = process.env.ADMIN_USER;
      adminUser.hashedPass = await this.utilServise.hashData(
        process.env.ADMIN_PASS,
      );
      adminUser.firstName = 'ADMIN';
      adminUser.role = Role.Admin;

      const admin = await this.usersRepository.save(adminUser);
      const tokens = await this.utilServise.getTokens(
        admin.id,
        admin.email,
        admin.role,
      );
      await this.utilServise.updateRtHash(admin.id, tokens.refreshToken);
      console.log('Admin user created');
    }
  }

  generateAccessToken(user: User): string {
    const payload = { sub: user.id, email: user.email };
    return this.jwtService.sign(payload);
  }
}
