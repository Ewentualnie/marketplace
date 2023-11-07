import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../models/user.entity';
import { FeedBack } from '../models/feedback.entity';
import { Hobby } from '../models/hobby.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, FeedBack, Hobby])],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
