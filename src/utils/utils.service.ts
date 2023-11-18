import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Country } from 'src/models/country.entity';
import { CountryDto } from 'src/models/dto/add-country.dto';
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
    @InjectRepository(Country)
    private countryRepository: Repository<Country>,
  ) {}

  async initializeLanguages() {
    if ((await this.languageRepository.count()) === 0) {
      const languageData = [
        { languageEn: 'English', languageUa: 'Англійська' },
        { languageEn: 'Ukrainian', languageUa: 'Українська' },
        { languageEn: 'German', languageUa: 'Німецька' },
        { languageEn: 'Polish', languageUa: 'Польська' },
        { languageEn: 'French', languageUa: 'Французька' },
        { languageEn: 'Italian', languageUa: 'Італійська' },
      ];
      for (const val of languageData) {
        await this.languageRepository.save(
          Object.assign(new Language(), {
            languageEn: val.languageEn,
            languageUa: val.languageUa,
          }),
        );
      }
    }
  }

  async initializeSpecializations() {
    if ((await this.specializationRepository.count()) === 0) {
      const specializationsData = [
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
      ];
      for (const val of specializationsData) {
        await this.specializationRepository.save(
          Object.assign(new Specialization(), {
            specializationEn: val.specializationEn,
            specializationUa: val.specializationUa,
          }),
        );
      }
    }
  }

  async initializeCountries() {
    if ((await this.countryRepository.count()) === 0) {
      const countryData = [
        { countryEn: 'Ukraine', countryUa: 'Україна' },
        { countryEn: 'Greet Britan', countryUa: 'Англія' },
        { countryEn: 'France', countryUa: 'Франція' },
        { countryEn: 'Poland', countryUa: 'Польща' },
        { countryEn: 'Germany', countryUa: 'Німеччина' },
      ];
      for (const val of countryData) {
        await this.countryRepository.save(
          Object.assign(new Country(), {
            countryEn: val.countryEn,
            countryUa: val.countryUa,
          }),
        );
      }
    }
  }

  async getAllLanguages() {
    return await this.languageRepository.find();
  }

  async getAllSpecializations() {
    return await this.specializationRepository.find();
  }

  async getAllCountries() {
    return await this.countryRepository.find();
  }

  async addLanguage(newLanguage: LanguageDto) {
    return this.languageRepository.save(newLanguage);
  }

  async addSpecialization(newSpecialization: SpecializationDto) {
    return this.specializationRepository.save(newSpecialization);
  }

  async addCountry(newCountry: CountryDto) {
    return this.countryRepository.save(newCountry);
  }

  async findCountry(country: Country) {
    return await this.countryRepository.findOne({
      where: { countryEn: country.countryEn, countryUa: country.countryUa },
    });
  }
}
