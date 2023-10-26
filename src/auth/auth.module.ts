import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { UsersService } from 'src/users/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { AtStrategy } from './strategies/at.strategy';
import { RtStrategy } from './strategies/rt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { FeedBack } from 'src/users/entities/feedback.entity';

@Module({
  imports: [
    UsersModule,
    TypeOrmModule.forFeature([User, FeedBack]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({ secret: 'at-secret' }),
  ],
  controllers: [AuthController],
  providers: [AuthService, UsersService, AtStrategy, RtStrategy],
})
export class AuthModule {}
