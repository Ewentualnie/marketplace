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
import { UsersService } from './users.service';
import { UpdateUserDto } from '../models/dto/update-user.dto';
import { GetCurrentUserId } from 'src/utils/decorators/get-user-id.decorator';
import { CreateFeedback } from '../models/dto/add-feedback.dto';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { FeedBack } from '../models/feedback.entity';
import { User } from '../models/user.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { Mail } from 'src/models/mail.entity';
import { MailDto } from 'src/models/dto/create-mail.dto';
import { UpdateUserEmailDto } from 'src/models/dto/updateUserEmail.dto';
import { UpdateUserPasswordDto } from 'src/models/dto/updateUserPassword.dto';
import { UserRes } from 'src/types/user-response';

@ApiTags('User')
@ApiBearerAuth()
@Controller('users')
@UsePipes(new ValidationPipe())
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getCurrentUser(@GetCurrentUserId() currentUserId: number) {
    return this, this.usersService.findOne(currentUserId);
  }

  @Get('/conversations')
  getMails(@GetCurrentUserId() currentUserId: number) {
    return this.usersService.getMails(currentUserId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return this.usersService.findOne(id);
  }

  @Patch()
  @UseInterceptors(FileInterceptor('photo'))
  update(
    @UploadedFile() photo: Express.Multer.File,
    @GetCurrentUserId() id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.usersService.updateUserInfo(id, updateUserDto, photo);
  }

  @Patch('email')
  @ApiOperation({ summary: 'Update user`s email' })
  updateEmail(
    @GetCurrentUserId() id: number,
    @Body() updateUserEmailDto: UpdateUserEmailDto,
  ): Promise<User> {
    return this.usersService.updateEmail(id, updateUserEmailDto);
  }

  @Patch('password')
  @ApiOperation({ summary: 'Update user`s password' })
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
  sendMail(
    @Param('id', ParseIntPipe) userId: number,
    @GetCurrentUserId() currentUserId: number,
    @Body() dto: MailDto,
  ): Promise<Mail> {
    return this.usersService.sendMail(dto, currentUserId, userId);
  }

  @Get(':id/conversation')
  getConversation(
    @Param('id', ParseIntPipe) userId: number,
    @GetCurrentUserId() currentUserId: number,
  ): Promise<Mail[]> {
    return this.usersService.getConversation(currentUserId, userId);
  }
}
