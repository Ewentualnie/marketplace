import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LanguageDto } from 'src/models/dto/add-language.dto';
import { SpecializationDto } from 'src/models/dto/add-specialization.dto';
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
      [
        { languageEn: 'English', languageUa: 'Англійська' },
        { languageEn: 'Ukrainian', languageUa: 'Українська' },
        { languageEn: 'German', languageUa: 'Німецька' },
        { languageEn: 'Polish', languageUa: 'Польська' },
        { languageEn: 'French', languageUa: 'Французька' },
        { languageEn: 'Italian', languageUa: 'Італійська' },
      ].forEach(async (val) => {
        await this.languageRepository.save(
          Object.assign(new Language(), {
            languageEn: val.languageEn,
            languageUa: val.languageUa,
          }),
        );
      });
    }
  }

  async initializeSpecializations() {
    if ((await this.specializationRepository.count()) === 0) {
      [
        {
          specializationEn: 'Speaking language',
          specializationUa: 'Розмовна мова',
        },
        {
          specializationEn: 'Learning the basics',
          specializationUa: 'Вивчення азів',
        },
        {
          specializationEn: 'For children',
          specializationUa: 'Для дітей',
        },
        {
          specializationEn: 'For adult',
          specializationUa: 'Для дорослих',
        },
        {
          specializationEn: 'Preparation for exams',
          specializationUa: 'Підготовка до іспитів',
        },
        {
          specializationEn: 'Studying grammar',
          specializationUa: 'Вивчення граматики',
        },
        { specializationEn: 'For IT', specializationUa: 'Для IT' },
      ].forEach(async (val) => {
        await this.specializationRepository.save(
          Object.assign(new Specialization(), {
            specializationEn: val.specializationEn,
            specializationUa: val.specializationUa,
          }),
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

  async addLanguage(newLanguage: LanguageDto) {
    return this.languageRepository.save(newLanguage);
  }

  async addSpecialization(newSpecialization: SpecializationDto) {
    return this.specializationRepository.save(newSpecialization);
  }
}
