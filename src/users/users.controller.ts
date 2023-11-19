import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
  ParseIntPipe,
  Post,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from '../models/dto/update-user.dto';
import { GetCurrentUserId } from 'src/utils/decorators/get-user-id.decorator';
import { CreateFeedback } from '../models/dto/add-feedback.dto';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { FeedBack } from '../models/feedback.entity';
import { User } from '../models/user.entity';
import { UpdateResult } from 'typeorm';
import { FilesInterceptor } from '@nestjs/platform-express';

@ApiTags('User')
@ApiBearerAuth()
@Controller('users')
@UsePipes(new ValidationPipe())
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return this.usersService.findOne(id);
  }

  @Patch()
  @UseInterceptors(FilesInterceptor('photo'))
  update(
    @UploadedFile() file: Express.Multer.File,
    @GetCurrentUserId() id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    // console.log(`log in controller, file is ${file}`);

    return this.usersService.updateUserInfo(id, updateUserDto, file);
  }

  @Delete()
  remove(@GetCurrentUserId() id: number): Promise<UpdateResult> {
    return this.usersService.softUserDelete(id);
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
}
