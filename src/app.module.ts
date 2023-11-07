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

@Module({
  imports: [
    TypeOrmModule.forFeature([Language]),
    TypeOrmModule.forRoot(dataSourceOptionst),
    UsersModule,
    AdvertModule,
    AuthModule,
    AdminModule,
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
