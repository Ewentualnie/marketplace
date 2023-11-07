import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { UsersService } from 'src/users/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { AtStrategy } from './strategies/at.strategy';
import { RtStrategy } from './strategies/rt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { FeedBack } from 'src/users/entities/feedback.entity';
import { Hobby } from 'src/users/entities/hobby.entity';
import { UtilsService } from 'src/utils/utils.service';
import { Language } from 'src/advert/entities/language.entity';

@Module({
  imports: [
    UsersModule,
    TypeOrmModule.forFeature([User, FeedBack, Hobby, Language]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({ secret: 'at-secret' }),
  ],
  controllers: [AuthController],
  providers: [AuthService, UsersService, AtStrategy, RtStrategy, UtilsService],
})
export class AuthModule {}
