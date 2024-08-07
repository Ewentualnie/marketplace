import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  UsePipes,
  ValidationPipe,
  ParseIntPipe,
  Post,
  UseInterceptors,
  UploadedFile,
  Put,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { GetCurrentUserId } from 'src/utils/decorators/get-user-id.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { ChatService } from 'src/utils/chat.service';
import UpdateUserDto from '../models/dto/update-user.dto';
import CreateFeedback from '../models/dto/add-feedback.dto';
import FeedBack from '../models/feedback.entity';
import User from '../models/user.entity';
import MailDto from 'src/models/dto/create-mail.dto';
import UpdateUserEmailDto from 'src/models/dto/updateUserEmail.dto';
import UpdateUserPasswordDto from 'src/models/dto/updateUserPassword.dto';
import UserRes from 'src/types/user-response';
import Chat from 'src/models/chat.entity';

@ApiTags('User')
@ApiBearerAuth()
@Controller('users')
@UsePipes(new ValidationPipe())
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly chatService: ChatService,
  ) {}

  @Get()
  getCurrentUser(@GetCurrentUserId() currentUserId: number) {
    return this, this.usersService.findOne(currentUserId);
  }

  @Get('/conversations')
  getChats(@GetCurrentUserId() currentUserId: number): Promise<Chat[]> {
    return this.chatService.getChats(currentUserId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return this.usersService.findOne(id);
  }

  @Patch('photo')
  @UseInterceptors(FileInterceptor('photo'))
  updatePhoto(
    @UploadedFile() photo: Express.Multer.File,
    @GetCurrentUserId() id: number,
  ): Promise<User> {
    return this.usersService.updateUserPhoto(id, photo);
  }

  @Patch()
  updateInfo(
    @GetCurrentUserId() id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.usersService.updateUserInfo(id, updateUserDto);
  }

  @Patch('email')
  @ApiOperation({ summary: 'Update user`s email' })
  @ApiResponse({
    status: 200,
    description: 'User information ',
    content: {
      'application/json': {
        example: {
          id: 3,
          email: 'test1@test.com',
          firstName: 'Boris',
          lastName: null,
          role: 'user',
          isDeleted: false,
          lastVisit: '2024-04-24T10:10:49.265Z',
          registeredAt: '2024-04-24T05:21:05.714Z',
          rating: 5,
          birthday: null,
          sex: null,
          photoPath: null,
          aboutMe: null,
          advert: null,
          feedbacksToMe: [],
          feedbacksFromMe: [],
          country: null,
        },
      },
    },
  })
  updateEmail(
    @GetCurrentUserId() id: number,
    @Body() updateUserEmailDto: UpdateUserEmailDto,
  ): Promise<User> {
    return this.usersService.updateEmail(id, updateUserEmailDto);
  }

  @Patch('password')
  @ApiOperation({ summary: 'Update user`s password' })
  @ApiResponse({
    status: 200,
    description: 'User information ',
    content: {
      'application/json': {
        example: {
          user: {
            id: 3,
            email: 'test1@test.com',
            firstName: 'Boris',
            lastName: null,
            role: 'user',
            isDeleted: false,
            lastVisit: '2024-04-24T10:10:49.265Z',
            registeredAt: '2024-04-24T05:21:05.714Z',
            rating: 5,
            birthday: null,
            sex: null,
            photoPath: null,
            aboutMe: null,
            advert: null,
            feedbacksToMe: [],
            feedbacksFromMe: [],
            country: null,
          },
          tokens: {
            accessToken: 'accessToken',
            refreshToken: 'refreshToken',
          },
        },
      },
    },
  })
  updatePassword(
    @GetCurrentUserId() id: number,
    @Body() updateUserPasswordDto: UpdateUserPasswordDto,
  ): Promise<UserRes> {
    return this.usersService.updatePassword(id, updateUserPasswordDto);
  }

  @Put()
  deleteRestoreUser(@GetCurrentUserId() id: number): Promise<User> {
    return this.usersService.deleteRestoreUser(id);
  }

  @ApiOperation({ summary: 'Create a feedback' })
  @Post(':id/feedback')
  addFeedback(
    @Param('id', ParseIntPipe) userId: number,
    @GetCurrentUserId() currentUserId: number,
    @Body() feedback: CreateFeedback,
  ): Promise<FeedBack> {
    return this.usersService.addFeedback(userId, currentUserId, feedback);
  }

  @Post(':id/conversation')
  sendMessage(
    @Param('id', ParseIntPipe) userId: number,
    @GetCurrentUserId() currentUserId: number,
    @Body() dto: MailDto,
  ): Promise<Chat> {
    return this.chatService.sendMessage(dto, currentUserId, userId);
  }

  @Get(':id/conversation')
  getChat(
    @Param('id', ParseIntPipe) userId: number,
    @GetCurrentUserId() currentUserId: number,
  ): Promise<Chat> {
    return this.chatService.getChat(currentUserId, userId);
  }

  @Get(':id/favorite')
  getLikes(
    @Param('id', ParseIntPipe) userId: number,
    @GetCurrentUserId() currentUserId: number,
  ) {
    return this.usersService.getLikes(userId);
  }
}
