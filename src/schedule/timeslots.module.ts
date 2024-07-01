import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { CloudinaryService } from 'src/utils/cloudinary.service';
import { UtilsService } from 'src/utils/utils.service';
import { TimeSlotsController } from './timeslots.controler';
import { TimeSlotsService } from './timeslots.service';
import User from '../models/user.entity';
import FeedBack from '../models/feedback.entity';
import Country from 'src/models/country.entity';
import Language from 'src/models/language.entity';
import Specialization from 'src/models/specialization.entity';
import Advert from 'src/models/advert.entity';
import Chat from 'src/models/chat.entity';
import Message from 'src/models/message.entity';
import TimeSlot from 'src/models/timeslot.entity';
import TimeSlots from 'src/models/user-slots.entity';

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
      TimeSlots,
      TimeSlot,
    ]),
  ],
  controllers: [TimeSlotsController],
  providers: [TimeSlotsService, CloudinaryService, UtilsService, JwtService],
})
export class TimeSlotsModule {}
