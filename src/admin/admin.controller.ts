import { Controller, Get, Query } from '@nestjs/common';
import { AdvertService } from 'src/advert/advert.service';
import { UsersService } from 'src/users/users.service';
import { Roles } from 'src/utils/decorators/roles.decorator';
import { Role } from 'src/utils/role.enum';

@Controller('admin')
export class AdminController {
  constructor(
    private readonly advertService: AdvertService,
    private readonly usersService: UsersService,
  ) {}

  @Get()
  @Roles(Role.Admin)
  async getAllAdverts(@Query() query: any) {
    const adverts = await this.advertService.findAll(query);
    const users = await this.usersService.findAll();
    return { adverts, users };
  }
}
