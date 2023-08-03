import { Module } from '@nestjs/common';
import { AdvertService } from './advert.service';
import { AdvertController } from './advert.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Advert } from './entities/advert.entity';
import { Hobby } from './entities/hobby.entity';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Advert, Hobby])],
  controllers: [AdvertController],
  providers: [AdvertService, UsersService],
})
export class AdvertModule {}
