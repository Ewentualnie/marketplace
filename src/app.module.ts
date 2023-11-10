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
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { ConfigModule } from '@nestjs/config';

import { Hobby } from './models/hobby.entity';
import { Specialization } from './models/specialization.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ['sql.env'] }),
    TypeOrmModule.forFeature([Language, Hobby, Specialization]),
    TypeOrmModule.forRoot(dataSourceOptionst),
    UsersModule,
    AdvertModule,
    AuthModule,
    AdminModule,
    CloudinaryModule,
  ],
  controllers: [AppController],
  providers: [
    UtilsService,
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
