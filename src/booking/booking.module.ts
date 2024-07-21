import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { CloudinaryService } from 'src/utils/cloudinary.service';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';
import { UtilsService } from 'src/utils/utils.service';
import { UsersService } from 'src/users/users.service';
import User from '../models/user.entity';
import FeedBack from '../models/feedback.entity';
import Country from 'src/models/country.entity';
import Language from 'src/models/language.entity';
import Specialization from 'src/models/specialization.entity';
import Advert from 'src/models/advert.entity';
import Chat from 'src/models/chat.entity';
import Message from 'src/models/message.entity';
import TimeSlot from 'src/models/timeslot.entity';
import Booking from 'src/models/booking.entity';

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
      Booking,
    ]),
  ],
  controllers: [BookingController],
  providers: [
    BookingService,
    CloudinaryService,
    UtilsService,
    JwtService,
    UsersService,
  ],
})
export class BookingModule {}
