import { Injectable } from '@nestjs/common';
import { Language } from './models/language.entity';
import { UtilsService } from './utils/utils.service';
import { Specialization } from './models/specialization.entity';

@Injectable()
export class AppService {
  constructor(private readonly utilsService: UtilsService) {}

  async getLanguages(): Promise<Language[]> {
    return this.utilsService.getAllLanguages();
  }

  async getSpecializations(): Promise<Specialization[]> {
    return this.utilsService.getAllSpecializations();
  }
}
