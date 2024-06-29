import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../models/user.entity';
import { FeedBack } from '../models/feedback.entity';
import { CloudinaryService } from 'src/utils/cloudinary.service';
import { Country } from 'src/models/country.entity';
import { UtilsService } from 'src/utils/utils.service';
import { Language } from 'src/models/language.entity';
import { Specialization } from 'src/models/specialization.entity';
import { Advert } from 'src/models/advert.entity';
import { JwtService } from '@nestjs/jwt';
import { Chat } from 'src/models/chat.entity';
import { Message } from 'src/models/message.entity';
import Schedule from 'src/models/schedule.entity';
import TimeSlot from 'src/models/timeslot.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      FeedBack,
      Country,
      Language,
      Specialization,
      Advert,
      Chat,
      Message,
      Schedule,
      TimeSlot,
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService, CloudinaryService, UtilsService, JwtService],
})
export class UsersModule {}
