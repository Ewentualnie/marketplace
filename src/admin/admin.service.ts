import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AdvertService } from 'src/advert/advert.service';
import { UpdateAdvertDto } from 'src/advert/dto/update-advert.dto';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { Role } from 'src/utils/role.enum';

@Injectable()
export class AdminService {
  constructor(
    private readonly advertService: AdvertService,
    private readonly usersService: UsersService,
  ) {}

  async getAll(admin: User, query: any) {
    if (admin.role != Role.Admin) {
      this.errorExeption('this page');
    }
    const adverts = await this.advertService.findAllowedAdverts(query);
    const users = await this.usersService.findAll();
    return { adverts, users };
  }

  async deleteUser(admin: User, id: number) {
    if (admin.role != Role.Admin) {
      this.errorExeption('delete users');
    }
    const user = await this.usersService.findOne(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.advert != null) {
      await this.advertService.softDeleteAdvert(user.advert.id);
    }
    return await this.usersService.softUserDelete(id);
  }

  async deleteAdvert(admin: User, id: number) {
    if (admin.role != Role.Admin) {
      this.errorExeption('delete adverts');
    }
    return await this.advertService.softDeleteAdvert(id);
  }

  async editUser(admin: User, id: number, updateUserDto: UpdateUserDto) {
    return 'not implement yet';
  }

  async editAdvert(admin: User, id: number, updateAdvertDto: UpdateAdvertDto) {
    return 'not implement yet';
  }

  errorExeption(message: string) {
    throw new ForbiddenException(
      `Only administrators have access to ${message}`,
    );
  }
}
