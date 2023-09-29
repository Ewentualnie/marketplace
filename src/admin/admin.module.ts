import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdvertService } from 'src/advert/advert.service';
import { UsersService } from 'src/users/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { Advert } from 'src/advert/entities/advert.entity';
import { Hobby } from 'src/advert/entities/hobby.entity';
import { Language } from 'src/advert/entities/language.entity';
import { User } from 'src/users/entities/user.entity';
import { AdminService } from './admin.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Advert, Hobby, Language]),
    JwtModule,
  ],
  controllers: [AdminController],
  providers: [AdvertService, UsersService, AdminService],
})
export class AdminModule {}
