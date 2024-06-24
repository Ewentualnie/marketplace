import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { GetCurrentUserId } from 'src/utils/decorators/get-user-id.decorator';
import { UpdateUserDto } from 'src/models/dto/update-user.dto';
import { UpdateAdvertDto } from 'src/models/dto/update-advert.dto';
import { LanguageDto } from 'src/models/dto/add-language.dto';
import { CountryDto } from 'src/models/dto/add-country.dto';
import { SpecializationDto } from 'src/models/dto/add-specialization.dto';

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

  @Get('specializations')
  async getSpecializations() {
    return this.adminService.getSpecializations();
  }

  @Get('countries')
  async getCounties() {
    return this.adminService.getCountries();
  }

  @Put('users/:id')
  async deleteUser(@Param('id', ParseIntPipe) id: number) {
    return await this.adminService.deleteRestoreUser(id);
  }

  @Put('adverts/:id')
  async deleteRestoreAdvert(@Param('id', ParseIntPipe) id: number) {
    return await this.adminService.deleteRestoreAdvert(id);
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

  @Patch('languages/:id')
  async editLanguage(
    @Param('id', ParseIntPipe) id: number,
    @Body() language: LanguageDto,
  ) {
    return this.adminService.editLanguage(id, language);
  }

  @Patch('specializations/:id')
  async editSpecialization(
    @Param('id', ParseIntPipe) id: number,
    @Body() specialization: SpecializationDto,
  ) {
    return this.adminService.editSpecialization(id, specialization);
  }

  @Patch('countries/:id')
  async editCountry(
    @Param('id', ParseIntPipe) id: number,
    @Body() counry: CountryDto,
  ) {
    return this.adminService.editCountry(id, counry);
  }

  @Post('languages')
  async addLanguage(@Body() language: LanguageDto) {
    return this.adminService.addLanguage(language);
  }

  @Post('specializations')
  async addSpecialization(@Body() specialization: SpecializationDto) {
    return this.adminService.addSpecialization(specialization);
  }

  @Post('countries')
  async addCountry(@Body() country: CountryDto) {
    return this.adminService.addCountry(country);
  }

  @Delete('languages/:id')
  async deleteLanguage(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.deleteLanguage(id);
  }

  @Delete('specializations/:id')
  async deleteSpecialization(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.deleteSpecialization(id);
  }

  @Delete('countries/:id')
  async deleteCountry(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.deleteCountry(id);
  }

  @Post('test-users/:count')
  async addTestUsers(@Param('count', ParseIntPipe) count: number) {
    return this.adminService.addTestUsers(count);
  }
}
