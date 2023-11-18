import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AdvertService } from 'src/advert/advert.service';
import { CountryDto } from 'src/models/dto/add-country.dto';
import { LanguageDto } from 'src/models/dto/add-language.dto';
import { SpecializationDto } from 'src/models/dto/add-specialization.dto';
import { UpdateAdvertDto } from 'src/models/dto/update-advert.dto';
import { UpdateUserDto } from 'src/models/dto/update-user.dto';
import { FeedBack } from 'src/models/feedback.entity';
import { UsersService } from 'src/users/users.service';
import { UtilsService } from 'src/utils/utils.service';
import { Repository } from 'typeorm';

@Injectable()
export class AdminService {
  constructor(
    private readonly advertService: AdvertService,
    private readonly usersService: UsersService,
    private readonly utilsService: UtilsService,
    @InjectRepository(FeedBack) public feedbackRepository: Repository<FeedBack>,
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
    return this.utilsService.getAllLanguages();
  }

  async getSpecializations() {
    return this.utilsService.getAllSpecializations();
  }

  async getCountries() {
    return this.utilsService.getAllCountries();
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

  async deleteLanguage(id: number) {
    return this.utilsService.removeLanguage(id);
  }

  async deleteSpecialization(id: number) {
    return this.utilsService.removeSpecialization(id);
  }

  async deleteCountry(id: number) {
    return this.utilsService.removeCountry(id);
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

  async addLanguage(newLanguage: LanguageDto) {
    return await this.utilsService.addLanguage(newLanguage);
  }

  async addSpecialization(newSpecialization: SpecializationDto) {
    return await this.utilsService.addSpecialization(newSpecialization);
  }

  async addCountry(newCountry: CountryDto) {
    return await this.utilsService.addCountry(newCountry);
  }
}
