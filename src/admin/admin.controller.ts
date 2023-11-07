import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';
import { UpdateAdvertDto } from 'src/advert/dto/update-advert.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { GetCurrentUserId } from 'src/utils/decorators/get-user-id.decorator';

@ApiTags('Admin')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt-admin'))
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('users')
  async getUsers() {
    return await this.adminService.getUsers();
  }

  @Get('adverts')
  async getAdverts() {
    return await this.adminService.getAdverts();
  }

  @Get('feedbacks')
  async getFeedbacks() {
    return this.adminService.getFeedbacks();
  }

  @Get('languages')
  async getLanguages() {
    return this.adminService.getLanguages();
  }

  @Delete('users/:id')
  async deleteUser(@Param('id', ParseIntPipe) id: number) {
    return await this.adminService.deleteUser(id);
  }

  @Delete('adverts/:id')
  async deleteAdvert(@Param('id', ParseIntPipe) id: number) {
    return await this.adminService.deleteAdvert(id);
  }

  @Patch('users/:id')
  async editUserInfo(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return await this.adminService.editUser(id, updateUserDto);
  }

  @Patch('adverts/:id')
  async editAdvertInfo(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAdvertDto: UpdateAdvertDto,
    @GetCurrentUserId() userId: number,
  ) {
    return await this.adminService.editAdvert(id, updateAdvertDto, userId);
  }
}
