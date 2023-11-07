import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Language } from 'src/advert/entities/language.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UtilsService {
  constructor(
    @InjectRepository(Language)
    private languageRepository: Repository<Language>,
  ) {}

  async createLanguages() {
    const count = await this.languageRepository.count();

    if (count === 0) {
      const languages = ['English', 'Ukrainian', 'German', 'Polish', 'Italian'];

      for (const languageName of languages) {
        const language = new Language();
        language.language = languageName;
        await this.languageRepository.save(language);
      }
    }
  }
}
