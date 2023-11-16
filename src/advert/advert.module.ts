import { Module } from '@nestjs/common';
import { AdvertService } from './advert.service';
import { AdvertController } from './advert.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Hobby } from '../models/hobby.entity';
import { User } from 'src/models/user.entity';
import { UsersService } from 'src/users/users.service';
import { JwtModule } from '@nestjs/jwt';
import { FeedBack } from 'src/models/feedback.entity';
import { Advert } from 'src/models/advert.entity';
import { Language } from 'src/models/language.entity';
import { CloudinaryService } from 'src/utils/cloudinary.service';
import { UtilsService } from 'src/utils/utils.service';
import { Specialization } from 'src/models/specialization.entity';
import { Country } from 'src/models/country.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Advert,
      Hobby,
      Language,
      FeedBack,
      Specialization,
      Country,
    ]),
    JwtModule,
  ],
  controllers: [AdvertController],
  providers: [AdvertService, UsersService, CloudinaryService, UtilsService],
})
export class AdvertModule {}
