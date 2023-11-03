import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { FeedBack } from './entities/feedback.entity';
import { Hobby } from './entities/hobby.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, FeedBack, Hobby])],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
