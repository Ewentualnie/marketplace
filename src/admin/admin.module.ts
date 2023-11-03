import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdvertService } from 'src/advert/advert.service';
import { UsersService } from 'src/users/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { Advert } from 'src/advert/entities/advert.entity';
import { Hobby } from 'src/users/entities/hobby.entity';
import { Language } from 'src/advert/entities/language.entity';
import { User } from 'src/users/entities/user.entity';
import { AdminService } from './admin.service';
import { FeedBack } from 'src/users/entities/feedback.entity';
import { JwtAdminStrategy } from './strategies/admin.jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Advert, Hobby, Language, FeedBack]),
    JwtModule.register({
      secret: 'at-secret',
    }),
  ],
  controllers: [AdminController],
  providers: [AdvertService, UsersService, AdminService, JwtAdminStrategy],
})
export class AdminModule {}
