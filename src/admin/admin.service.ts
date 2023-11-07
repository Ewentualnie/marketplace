import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AdvertService } from 'src/advert/advert.service';
import { UpdateAdvertDto } from 'src/models/dto/update-advert.dto';
import { UpdateUserDto } from 'src/models/dto/update-user.dto';
import { FeedBack } from 'src/models/feedback.entity';
import { Language } from 'src/models/language.entity';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';

@Injectable()
export class AdminService {
  constructor(
    private readonly advertService: AdvertService,
    private readonly usersService: UsersService,
    @InjectRepository(FeedBack) public feedbackRepository: Repository<FeedBack>,
    @InjectRepository(Language) public languageRepository: Repository<Language>,
  ) {}

  async getUsers() {
    return await this.usersService.findAll();
  }

  async getAdverts() {
    return await this.advertService.findAllAdverts();
  }

  async getFeedbacks() {
    return await this.feedbackRepository.find({
      relations: ['toUser', 'fromUsers'],
    });
  }

  async getLanguages() {
    return this.languageRepository.find();
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
