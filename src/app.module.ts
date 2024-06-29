import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdvertModule } from './advert/advert.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AtGuard } from './utils/guards/at-guard';
import { AdminModule } from './admin/admin.module';
import { dataSourceOptionst } from './database/database-config';
import { UtilsService } from './utils/utils.service';
import { Language } from './models/language.entity';
import { Specialization } from './models/specialization.entity';
import { CloudinaryService } from './utils/cloudinary.service';
import { Country } from './models/country.entity';
import { FeedBack } from './models/feedback.entity';
import { ConfigModule } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from './models/user.entity';
import { ScheduleModule } from './schedule/schedule.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([
      Language,
      Specialization,
      Country,
      FeedBack,
      User,
    ]),
    TypeOrmModule.forRoot(dataSourceOptionst),
    UsersModule,
    AdvertModule,
    AuthModule,
    AdminModule,
    ScheduleModule,
  ],
  controllers: [AppController],
  providers: [
    JwtService,
    UtilsService,
    CloudinaryService,
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: AtGuard,
    },
  ],
})
export class AppModule {}
