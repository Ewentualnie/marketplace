import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot(
      //   {
      //   type: 'mysql',
      //   host: 'sql_db',
      //   port: 3306,
      //   username: 'admin',
      //   password: 'root',
      //   database: 'marketplace',
      //   autoLoadEntities: true,
      //   synchronize: true,
      // }
      {
        type: 'postgres',
        host: 'dpg-cid99aunqqlb62hi8ic0-a',
        port: 5432,
        username: 'admin',
        password: '4JaXiFxFOoaGvN5ssDw1L9GIodADOEP5',
        database: 'marketplace_fs5r',
        autoLoadEntities: true,
        synchronize: true,
      },
    ),
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
