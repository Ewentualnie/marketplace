import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Language } from 'src/models/language.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UtilsService {
  constructor(
    @InjectRepository(Language)
    private languageRepository: Repository<Language>,
  ) {}

  async createLanguages() {
    if ((await this.languageRepository.count()) === 0) {
      ['English', 'Ukrainian', 'German', 'Polish', 'French', 'Italian'].forEach(
        async (language) => {
          await this.languageRepository.save(
            Object.assign(new Language(), { language }),
          );
        },
      );
    }
  }
}
