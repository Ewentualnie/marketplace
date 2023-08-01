import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from 'src/users/dto/login-user.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { GetCurrentUserId } from './decorators/get-user-id.decorator';
import { GetCurrentUser } from './decorators/get-user.decorator';
import { RtGuard } from './guards/rt-guard';
import { Public } from './decorators/public.decorator';
import { UserRes } from 'src/types/user-response';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('signup')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.CREATED)
  signUp(@Body() createUserDto: CreateUserDto): Promise<UserRes> {
    return this.authService.signUp(createUserDto);
  }

  @Public()
  @Post('signin')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  signIn(@Body() loginUserDto: LoginUserDto): Promise<UserRes> {
    return this.authService.signIn(loginUserDto);
  }

  @Post('logout')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  logOut(@GetCurrentUserId(ParseIntPipe) userId: number) {
    return this.authService.logOut(userId);
  }

  @Public()
  @UseGuards(RtGuard)
  @Post('refresh')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  refresh(
    @GetCurrentUserId(ParseIntPipe) userId: number,
    @GetCurrentUser('refreshToken') refreshToken: string,
  ): Promise<UserRes> {
    return this.authService.refresh(userId, refreshToken);
  }
}
