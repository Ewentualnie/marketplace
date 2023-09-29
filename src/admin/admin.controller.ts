import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Query,
} from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import { GetCurrentUser } from 'src/utils/decorators/get-user.decorator';
import { AdminService } from './admin.service';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';
import { UpdateAdvertDto } from 'src/advert/dto/update-advert.dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get()
  async getAll(@GetCurrentUser() user: User, @Query() query: any) {
    return await this.adminService.getAll(user, query);
  }

  @Delete('users/:id')
  async deleteUser(
    @GetCurrentUser() user: User,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return await this.adminService.deleteUser(user, id);
  }

  @Delete('adverts/:id')
  async deleteAdvert(
    @GetCurrentUser() user: User,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return await this.adminService.deleteAdvert(user, id);
  }

  @Patch('users/:id')
  async editUserInfo(
    @GetCurrentUser() user: User,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return await this.adminService.editUser(user, id, updateUserDto);
  }

  @Patch('adverts/:id')
  async editAdvertInfo(
    @GetCurrentUser() user: User,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAdvertDto: UpdateAdvertDto,
  ) {
    return await this.adminService.editAdvert(user, id, updateAdvertDto);
  }
}
