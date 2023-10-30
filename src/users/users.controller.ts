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
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { GetCurrentUserId } from 'src/utils/decorators/get-user-id.decorator';
import { CreateFeedback } from './dto/add-feedback.dto';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('User')
@ApiBearerAuth()
@Controller('users')
@UsePipes(new ValidationPipe())
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  @Patch()
  update(@GetCurrentUserId() id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateUserInfo(id, updateUserDto);
  }

  @Delete()
  remove(@GetCurrentUserId() id: number) {
    return this.usersService.softUserDelete(id);
  }

  @ApiOperation({ summary: 'Create a feedback' })
  @Post(':id/feedback')
  addFeedback(
    @Param('id', ParseIntPipe) userId: number,
    @GetCurrentUserId() currentUserId: number,
    @Body() feedback: CreateFeedback,
  ): Promise<void> {
    return this.usersService.addFeedback(userId, currentUserId, feedback);
  }
}
