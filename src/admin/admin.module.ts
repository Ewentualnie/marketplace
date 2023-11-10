import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdvertService } from 'src/advert/advert.service';
import { UsersService } from 'src/users/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { Hobby } from 'src/models/hobby.entity';
import { User } from 'src/models/user.entity';
import { AdminService } from './admin.service';
import { FeedBack } from 'src/models/feedback.entity';
import { JwtAdminStrategy } from './strategies/admin.jwt.strategy';
import { Advert } from 'src/models/advert.entity';
import { Language } from 'src/models/language.entity';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Advert, Hobby, Language, FeedBack]),
    JwtModule.register({
      secret: 'at-secret',
    }),
  ],
  controllers: [AdminController],
  providers: [
    AdvertService,
    UsersService,
    AdminService,
    JwtAdminStrategy,
    CloudinaryService,
  ],
})
export class AdminModule {}
