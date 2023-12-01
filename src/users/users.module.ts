import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../models/user.entity';
import { FeedBack } from '../models/feedback.entity';
import { Hobby } from '../models/hobby.entity';
import { CloudinaryService } from 'src/utils/cloudinary.service';
import { Country } from 'src/models/country.entity';
import { UtilsService } from 'src/utils/utils.service';
import { Language } from 'src/models/language.entity';
import { Specialization } from 'src/models/specialization.entity';
import { Advert } from 'src/models/advert.entity';
import { Mail } from 'src/models/mail.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      FeedBack,
      Hobby,
      Country,
      Language,
      Specialization,
      Advert,
      Mail,
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService, CloudinaryService, UtilsService],
})
export class UsersModule {}
