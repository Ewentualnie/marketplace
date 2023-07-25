import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdvertisementsModule } from './advertisements/advertisements.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      // type: 'postgres',
      // host: 'dpg-cid99aunqqlb62hi8ic0-a',
      // port: 5432,
      // username: 'admin',
      // password: '4JaXiFxFOoaGvN5ssDw1L9GIodADOEP5',
      // database: 'marketplace_fs5r',

      // type: 'postgres',
      // host: 'postgres_db',
      // port: 5432,
      // username: 'admin',
      // password: 'root',
      // database: 'marketplace',

      type: 'postgres',
      host: process.env.HOST || 'localhost',
      port: 5432,
      username: process.env.HOST || 'admin',
      password: process.env.PASS || 'root',
      database: process.env.DATABASE || 'marketplace',

      autoLoadEntities: true,
      synchronize: true,
    }),
    UsersModule,
    AdvertisementsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
