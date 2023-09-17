import {
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { AdvertService } from 'src/advert/advert.service';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { GetCurrentUser } from 'src/utils/decorators/get-user.decorator';
import { Role } from 'src/utils/role.enum';

@Controller('admin')
export class AdminController {
  constructor(
    private readonly advertService: AdvertService,
    private readonly usersService: UsersService,
  ) {}

  @Get()
  async getAllAdverts(@GetCurrentUser() user: User, @Query() query: any) {
    if (user.role == Role.Admin) {
      const adverts = await this.advertService.findAll(query);
      const users = await this.usersService.findAll();
      return { adverts, users };
    } else this.errorExeption('to this page');
  }

  @Delete('users/:id')
  async deleteUser(
    @GetCurrentUser() user: User,
    @Param('id', ParseIntPipe) id: number,
  ) {
    if (user.role == Role.Admin) {
      await this.usersService.remove(id);
    } else {
      this.errorExeption('to delete users');
    }
  }

  @Delete('adverts/:id')
  async deleteAdvert(
    @GetCurrentUser() user: User,
    @Param('id', ParseIntPipe) id: number,
  ) {
    if (user.role == Role.Admin) {
      await this.advertService.remove(id, user);
    } else {
      this.errorExeption('to delete adverts');
    }
  }

  errorExeption(message: string) {
    throw new ForbiddenException('Only administrators have access ' + message);
  }
}
