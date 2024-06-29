import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { UsersService } from 'src/users/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/models/user.entity';
import { AtStrategy } from './strategies/at.strategy';
import { RtStrategy } from './strategies/rt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { FeedBack } from 'src/models/feedback.entity';
import { CloudinaryService } from 'src/utils/cloudinary.service';
import { UtilsService } from 'src/utils/utils.service';
import { Language } from 'src/models/language.entity';
import { Specialization } from 'src/models/specialization.entity';
import { Country } from 'src/models/country.entity';
import { Advert } from 'src/models/advert.entity';
import { Chat } from 'src/models/chat.entity';
import { Message } from 'src/models/message.entity';
import Schedule from 'src/models/schedule.entity';
import TimeSlot from 'src/models/timeslot.entity';

@Module({
  imports: [
    UsersModule,
    TypeOrmModule.forFeature([
      User,
      FeedBack,
      Language,
      Specialization,
      Country,
      Advert,
      Chat,
      Message,
      Schedule,
      TimeSlot,
    ]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({ secret: 'at-secret' }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UsersService,
    AtStrategy,
    RtStrategy,
    CloudinaryService,
    UtilsService,
  ],
})
export class AuthModule {}
