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
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { GetCurrentUserId } from 'src/utils/decorators/get-user-id.decorator';

@Controller('users')
@UsePipes(new ValidationPipe())
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

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
}
