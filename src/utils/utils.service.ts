import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Country } from 'src/models/country.entity';
import { CountryDto } from 'src/models/dto/add-country.dto';
import { LanguageDto } from 'src/models/dto/add-language.dto';
import { SpecializationDto } from 'src/models/dto/add-specialization.dto';
import { FeedBack } from 'src/models/feedback.entity';
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
    @InjectRepository(FeedBack)
    private feedbackRepository: Repository<FeedBack>,
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
      console.log(
        `Language table initialized, ${await this.languageRepository.count()} languages added`,
      );
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
      console.log(
        `Specialization table initialized, ${await this.specializationRepository.count()} specializations added`,
      );
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
      console.log(
        `Country table initialized, ${await this.countryRepository.count()} countries added`,
      );
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

  async getAllFeedbacks() {
    return await this.feedbackRepository.find({
      relations: ['toUser', 'fromUser'],
    });
  }

  async addLanguage(newLanguage: LanguageDto) {
    const language = await this.languageRepository.findOne({
      where: {
        languageEn: newLanguage.languageEn,
        languageUa: newLanguage.languageUa,
      },
    });
    if (!language) {
      return this.languageRepository.save(newLanguage);
    }
    throw new BadRequestException(
      `Language ${newLanguage} already exists in the database`,
    );
  }

  async addSpecialization(newSpecialization: SpecializationDto) {
    const specialization = await this.specializationRepository.findOne({
      where: {
        specializationEn: newSpecialization.specializationEn,
        specializationUa: newSpecialization.specializationUa,
      },
    });
    if (!specialization) {
      return this.specializationRepository.save(newSpecialization);
    }
    throw new BadRequestException(
      `Specialization ${newSpecialization} already exists in the database`,
    );
  }

  async addCountry(newCountry: CountryDto) {
    const specialization = await this.countryRepository.findOne({
      where: {
        countryEn: newCountry.countryEn,
        countryUa: newCountry.countryUa,
      },
    });
    if (!specialization) {
      return this.countryRepository.save(newCountry);
    }
    throw new BadRequestException(
      `Country ${newCountry} already exists in the database`,
    );
    return this.countryRepository.save(newCountry);
  }

  async findLanguage(id: number) {
    const language = await this.languageRepository.findOne({
      where: { id },
      relations: ['spokenLanguages', 'teachingLanguages'],
    });

    if (!language) {
      throw new NotFoundException(`Language with id: ${id} is not found`);
    }

    return language;
  }

  async findSpecialization(id: number) {
    const specialization = await this.specializationRepository.findOne({
      where: { id },
      relations: ['users'],
    });

    if (!specialization) {
      throw new NotFoundException(`Specialization with id: ${id} is not found`);
    }

    return specialization;
  }

  async findCountry(id: number) {
    const country = await this.countryRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!country) {
      throw new NotFoundException(`Country with id: ${id} is not found`);
    }

    return country;
  }

  async editLanguage(id: number, dto: LanguageDto) {
    const language = await this.findLanguage(id);
    language.languageEn = dto.languageEn ?? language.languageEn;
    language.languageUa = dto.languageUa ?? language.languageUa;
    return await this.languageRepository.save(language);
  }

  async editSpecialization(id: number, dto: SpecializationDto) {
    const specialization = await this.findSpecialization(id);
    specialization.specializationEn =
      dto.specializationEn ?? specialization.specializationEn;
    specialization.specializationUa =
      dto.specializationUa ?? specialization.specializationUa;
    return await this.specializationRepository.save(specialization);
  }

  async editCountry(id: number, dto: CountryDto) {
    const country = await this.findCountry(id);
    country.countryEn = dto.countryEn ?? country.countryEn;
    country.countryUa = dto.countryUa ?? country.countryUa;
    return await this.countryRepository.save(country);
  }

  async removeLanguage(id: number) {
    const toRemove = await this.findLanguage(id);

    if (
      toRemove.spokenLanguages.length > 0 ||
      toRemove.teachingLanguages.length > 0
    ) {
      throw new BadRequestException(
        `Language cannot be removed because it is used in adverts`,
      );
    }

    return await this.languageRepository.remove(toRemove);
  }

  async removeSpecialization(id: number) {
    const toRemove = await this.findSpecialization(id);

    if (toRemove.users.length > 0) {
      throw new BadRequestException(
        `Specialization cannot be removed because it is used by users`,
      );
    }

    return await this.specializationRepository.remove(toRemove);
  }

  async removeCountry(id: number) {
    const toRemove = await this.findCountry(id);

    if (toRemove.user.length > 0) {
      throw new BadRequestException(
        `Country cannot be removed because it is used by users`,
      );
    }
    return await this.countryRepository.remove(toRemove);
  }
}
