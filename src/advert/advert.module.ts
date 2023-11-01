import { Module } from '@nestjs/common';
import { AdvertService } from './advert.service';
import { AdvertController } from './advert.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Advert } from './entities/advert.entity';
import { Hobby } from '../users/entities/hobby.entity';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { JwtModule } from '@nestjs/jwt';
import { Language } from './entities/language.entity';
import { FeedBack } from 'src/users/entities/feedback.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Advert, Hobby, Language, FeedBack]),
    JwtModule,
  ],
  controllers: [AdvertController],
  providers: [AdvertService, UsersService],
})
export class AdvertModule {}
