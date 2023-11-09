import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Hobby } from 'src/models/hobby.entity';
import { Language } from 'src/models/language.entity';
import { Specialization } from 'src/models/specialization.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UtilsService {
  constructor(
    @InjectRepository(Language)
    private languageRepository: Repository<Language>,
    @InjectRepository(Hobby)
    private hobbyRepository: Repository<Hobby>,
    @InjectRepository(Specialization)
    private specializationRepository: Repository<Specialization>,
  ) {}

  async initializeLanguages() {
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

  async initializeSpecializations() {
    if ((await this.specializationRepository.count()) === 0) {
      [
        'Розмовна мова',
        'Вивчення азів',
        'Для дітей',
        'Для дорослих',
        'Підготовка до іспитів',
        'Граматика',
        'Для IT',
      ].forEach(async (specialization) => {
        await this.specializationRepository.save(
          Object.assign(new Language(), { specialization }),
        );
      });
    }
  }

  async getAllLanguages() {
    return await this.languageRepository.find();
  }

  async getAllSpecializations() {
    return await this.specializationRepository.find();
  }
}
