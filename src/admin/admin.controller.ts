import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import { GetCurrentUser } from 'src/utils/decorators/get-user.decorator';
import { AdminService } from './admin.service';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';
import { UpdateAdvertDto } from 'src/advert/dto/update-advert.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Admin')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt-admin'))
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @ApiOperation({ summary: 'Get information of all users by admin' })
  @ApiResponse({
    status: 200,
    description: 'List of users and adverts',
    content: {
      'application/json': {
        example: {
          adverts: [],
          users: [
            {
              id: 1,
              email: 'example@email.com',
              name: 'Name',
              role: 'role',
              isDeleted: 'boolean',
              advert: 'null',
            },
          ],
        },
      },
    },
  })
  @Get('users')
  async getUsers() {
    return await this.adminService.getUsers();
  }

  @Get('adverts')
  async getAdverts() {
    return await this.adminService.getAdverts();
  }

  @ApiOperation({ summary: 'Deleting user by admin' })
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
  ) {
    return await this.adminService.editAdvert(id, updateAdvertDto);
  }
}
