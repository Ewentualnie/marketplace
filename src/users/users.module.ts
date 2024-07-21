import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatService } from 'src/utils/chat.service';
import { JwtService } from '@nestjs/jwt';
import { UtilsService } from 'src/utils/utils.service';
import { CloudinaryService } from 'src/utils/cloudinary.service';
import User from '../models/user.entity';
import FeedBack from '../models/feedback.entity';
import Country from 'src/models/country.entity';
import Language from 'src/models/language.entity';
import Specialization from 'src/models/specialization.entity';
import Advert from 'src/models/advert.entity';
import Chat from 'src/models/chat.entity';
import Message from 'src/models/message.entity';
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
      TimeSlot,
    ]),
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    CloudinaryService,
    UtilsService,
    JwtService,
    ChatService,
  ],
})
export class UsersModule {}
