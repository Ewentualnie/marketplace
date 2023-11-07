import { Injectable } from '@nestjs/common';
import { AdvertService } from 'src/advert/advert.service';
import { UpdateAdvertDto } from 'src/advert/dto/update-advert.dto';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AdminService {
  constructor(
    private readonly advertService: AdvertService,
    private readonly usersService: UsersService,
  ) {}

  async getUsers() {
    return await this.usersService.findAll();
  }

  async getAdverts() {
    return await this.advertService.findAllAdverts();
  }

  async deleteUser(id: number) {
    const user = await this.usersService.findOne(id);
    if (user.advert != null) {
      await this.advertService.softDeleteAdvert(user.advert.id);
    }
    return await this.usersService.softUserDelete(id);
  }

  async deleteAdvert(id: number) {
    return await this.advertService.softDeleteAdvert(id);
  }

  async editUser(userId: number, updateUserDto: UpdateUserDto) {
    return this.usersService.updateUserInfo(userId, updateUserDto);
  }

  async editAdvert(
    id: number,
    updateAdvertDto: UpdateAdvertDto,
    userId: number,
  ) {
    return this.advertService.updateAdvertInfo(id, updateAdvertDto, userId);
  }
}
