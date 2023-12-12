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
import { GetCurrentUserId } from '../utils/decorators/get-user-id.decorator';
import { GetCurrentUser } from '../utils/decorators/get-user.decorator';
import { RtGuard } from '../utils/guards/rt-guard';
import { Public } from '../utils/decorators/public.decorator';
import { UserRes } from 'src/types/user-response';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CreateUserDto } from 'src/models/dto/create-user.dto';
import { LoginUserDto } from 'src/models/dto/login-user.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Create a user' })
  @ApiResponse({
    status: 201,
    description: 'User information ',
    content: {
      'application/json': {
        example: {
          user: {
            email: 'dekeucasukou-4452@yopmail.com',
            name: 'Boris',
            id: 3,
            role: 'user',
            isDeleted: 'boolean',
          },
          tokens: {
            accessToken: 'accessToken',
            refreshToken: 'refreshToken',
          },
        },
      },
    },
  })
  @Public()
  @Post('signup')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.CREATED)
  signUp(@Body() createUserDto: CreateUserDto): Promise<UserRes> {
    return this.authService.signUp(createUserDto);
  }

  @ApiOperation({ summary: 'Login by user' })
  @ApiResponse({
    status: 200,
    description: 'User information ',
    content: {
      'application/json': {
        example: {
          user: {
            email: 'dekeucasukou-4452@yopmail.com',
            name: 'Boris',
            id: 3,
            role: 'user',
            isDeleted: 'boolean',
          },
          tokens: {
            accessToken: 'accessToken',
            refreshToken: 'refreshToken',
          },
        },
      },
    },
  })
  @Public()
  @Post('signin')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  signIn(@Body() loginUserDto: LoginUserDto): Promise<UserRes> {
    return this.authService.signIn(loginUserDto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout' })
  @ApiResponse({ status: 204, description: 'No Content' })
  @Public()
  @Post('logout')
  @UseGuards(RtGuard)
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  logOut(@GetCurrentUserId(ParseIntPipe) userId: number) {
    console.log('userId2');
    return this.authService.logOut(userId);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Refresh tokens' })
  @ApiResponse({
    status: 200,
    description: 'User information ',
    content: {
      'application/json': {
        example: {
          user: {
            email: 'dekeucasukou-4452@yopmail.com',
            name: 'Boris',
            id: 3,
            role: 'user',
            isDeleted: 'boolean',
          },
          tokens: {
            accessToken: 'accessToken',
            refreshToken: 'refreshToken',
          },
        },
      },
    },
  })
  @Public()
  @UseGuards(RtGuard)
  @Post('refresh')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  refresh(
    @GetCurrentUserId(ParseIntPipe) userId: number,
    @GetCurrentUser('refreshToken') refreshToken: string,
  ): Promise<UserRes> {
    console.log(`User with id: "${userId}" try to refresh`);
    return this.authService.refresh(userId, refreshToken);
  }
}
