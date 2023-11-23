import { Injectable } from '@nestjs/common';
import { AdvertService } from 'src/advert/advert.service';
import { CountryDto } from 'src/models/dto/add-country.dto';
import { LanguageDto } from 'src/models/dto/add-language.dto';
import { SpecializationDto } from 'src/models/dto/add-specialization.dto';
import { UpdateAdvertDto } from 'src/models/dto/update-advert.dto';
import { UpdateUserDto } from 'src/models/dto/update-user.dto';
import { UsersService } from 'src/users/users.service';
import { UtilsService } from 'src/utils/utils.service';

@Injectable()
export class AdminService {
  constructor(
    private readonly advertService: AdvertService,
    private readonly usersService: UsersService,
    private readonly utilsService: UtilsService,
  ) {}

  async getUsers() {
    return await this.usersService.findAll();
  }

  async getAdverts() {
    return await this.advertService.findAllAdverts();
  }

  async getFeedbacks() {
    return this.utilsService.getAllFeedbacks();
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
    if (user.advert != null && !user.advert.isDeleted) {
      await this.advertService.deleteRestoreAdvert(user.advert.id);
    }
    return await this.usersService.softUserDelete(id);
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

  async deleteRestoreUser(userId) {
    return 'not implemented yet';
  }

  async deleteRestoreAdvert(advertId) {
    return this.advertService.deleteRestoreAdvert(advertId);
  }

  async editUser(userId: number, updateUserDto: UpdateUserDto) {
    return this.usersService.updateUserInfo(userId, updateUserDto);
  }

  async editAdvert(id: number, dto: UpdateAdvertDto, userId: number) {
    return this.advertService.updateAdvertInfo(id, dto, userId);
  }

  async editLanguage(id: number, dto: LanguageDto) {
    return this.utilsService.editLanguage(id, dto);
  }

  async editSpecialization(id: number, dto: SpecializationDto) {
    return this.utilsService.editSpecialization(id, dto);
  }

  async editCountry(id: number, dto: CountryDto) {
    return this.utilsService.editCountry(id, dto);
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
