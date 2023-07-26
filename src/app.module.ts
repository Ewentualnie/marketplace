import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdvertisementsModule } from './advertisements/advertisements.module';
import { User } from './users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST || 'localhost',
      // host: 'postgres_db',
      port: 5432,
      username: process.env.POSTGRES_USER || 'admin',
      password: process.env.POSTGRES_PASS || 'root',
      database: process.env.POSTGRES_DATABASE || 'marketplace',

      entities: [User],
      synchronize: true,
    }),
    UsersModule,
    AdvertisementsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
