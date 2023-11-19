import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from './utils/decorators/public.decorator';
import { Specialization } from './models/specialization.entity';
import { Language } from './models/language.entity';
import { Country } from './models/country.entity';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Get('languages')
  async getLanguages(): Promise<Language[]> {
    return this.appService.getLanguages();
  }

  @Public()
  @Get('specializations')
  async getSpecializations(): Promise<Specialization[]> {
    return this.appService.getSpecializations();
  }

  @Public()
  @Get('countries')
  async getCountries(): Promise<Country[]> {
    return this.appService.getCountries();
  }
}
