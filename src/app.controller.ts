import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from './utils/decorators/public.decorator';
import { Specialization } from './models/specialization.entity';
import { Language } from './models/language.entity';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Get('languages')
  getLanguages(): Promise<Language[]> {
    return this.appService.getLanguages();
  }

  @Public()
  @Get('specializations')
  getSpecializations(): Promise<Specialization[]> {
    return this.appService.getSpecializations();
  }
}
