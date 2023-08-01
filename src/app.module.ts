import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entities/user.entity';
import { AdvertModule } from './advert/advert.module';
import { Advert } from './advert/entities/advert.entity';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AtGuard } from './auth/guards/at-guard';
import { Hobby } from './advert/entities/hobby.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST || 'localhost',
      // host: 'postgres_db',    //need for run in local docker
      port: 5432,
      username: process.env.POSTGRES_USER || 'admin',
      password: process.env.POSTGRES_PASS || 'root',
      database: process.env.POSTGRES_DATABASE || 'marketplace',

      entities: [User, Advert, Hobby],
      synchronize: true,
      logging: ['query', 'info', 'warn', 'error'],
    }),
    UsersModule,
    AdvertModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
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
