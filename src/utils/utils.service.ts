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
import { Language } from 'src/models/language.entity';
import { Specialization } from 'src/models/specialization.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { genSalt } from 'bcrypt';
import { Tokens } from 'src/types/tokens.type';
import { User } from 'src/models/user.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UtilsService {
  constructor(
    @InjectRepository(Language)
    private languageRepository: Repository<Language>,
    @InjectRepository(Specialization)
    private specializationRepository: Repository<Specialization>,
    @InjectRepository(Country)
    private countryRepository: Repository<Country>,
    @InjectRepository(FeedBack)
    private feedbackRepository: Repository<FeedBack>,
    @InjectRepository(User)
    public usersRepository: Repository<User>,
    public jwtService: JwtService,
  ) {}

  async initializeLanguages() {
    if ((await this.languageRepository.count()) === 0) {
      const languageData = [
        { alpha2: 'en', languageEn: 'English', languageUa: 'Англійська' },
        { alpha2: 'uk', languageEn: 'Ukrainian', languageUa: 'Українська' },
        { alpha2: 'de', languageEn: 'German', languageUa: 'Німецька' },
        { alpha2: 'pl', languageEn: 'Polish', languageUa: 'Польська' },
        { alpha2: 'fr', languageEn: 'French', languageUa: 'Французька' },
        { alpha2: 'it', languageEn: 'Italian', languageUa: 'Італійська' },
      ];
      for (const val of languageData) {
        await this.languageRepository.save(
          Object.assign(new Language(), {
            alpha2: val.alpha2,
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
        { alpha2: 'AF' }, // Afghanistan
        { alpha2: 'AX' }, // Aland Islands
        { alpha2: 'AL' }, // Albania
        { alpha2: 'DZ' }, // Algeria
        { alpha2: 'AS' }, // American Samoa
        { alpha2: 'AD' }, // Andorra
        { alpha2: 'AO' }, // Angola
        { alpha2: 'AI' }, // Anguilla
        { alpha2: 'AQ' }, // Antarctica
        { alpha2: 'AG' }, // Antigua And Barbuda
        { alpha2: 'AR' }, // Argentina
        { alpha2: 'AM' }, // Armenia
        { alpha2: 'AW' }, // Aruba
        { alpha2: 'AU' }, // Australia
        { alpha2: 'AT' }, // Austria
        { alpha2: 'AZ' }, // Azerbaijan
        { alpha2: 'BS' }, // Bahamas
        { alpha2: 'BH' }, // Bahrain
        { alpha2: 'BD' }, // Bangladesh
        { alpha2: 'BB' }, // Barbados
        { alpha2: 'BY' }, // Belarus
        { alpha2: 'BE' }, // Belgium
        { alpha2: 'BZ' }, // Belize
        { alpha2: 'BJ' }, // Benin
        { alpha2: 'BM' }, // Bermuda
        { alpha2: 'BT' }, // Bhutan
        { alpha2: 'BO' }, // Bolivia
        { alpha2: 'BA' }, // Bosnia And Herzegovina
        { alpha2: 'BW' }, // Botswana
        { alpha2: 'BV' }, // Bouvet Island
        { alpha2: 'BR' }, // Brazil
        { alpha2: 'IO' }, // British Indian Ocean Territory
        { alpha2: 'BN' }, // Brunei Darussalam
        { alpha2: 'BG' }, // Bulgaria
        { alpha2: 'BF' }, // Burkina Faso
        { alpha2: 'BI' }, // Burundi
        { alpha2: 'KH' }, // Cambodia
        { alpha2: 'CM' }, // Cameroon
        { alpha2: 'CA' }, // Canada
        { alpha2: 'CV' }, // Cape Verde
        { alpha2: 'KY' }, // Cayman Islands
        { alpha2: 'CF' }, // Central African Republic
        { alpha2: 'TD' }, // Chad
        { alpha2: 'CL' }, // Chile
        { alpha2: 'CN' }, // China
        { alpha2: 'CX' }, // Christmas Island
        { alpha2: 'CC' }, // Cocos (Keeling) Islands
        { alpha2: 'CO' }, // Colombia
        { alpha2: 'KM' }, // Comoros
        { alpha2: 'CG' }, // Congo
        { alpha2: 'CD' }, // Congo, Democratic Republic
        { alpha2: 'CK' }, // Cook Islands
        { alpha2: 'CR' }, // Costa Rica
        { alpha2: 'CI' }, // Cote D"Ivoire
        { alpha2: 'HR' }, // Croatia
        { alpha2: 'CU' }, // Cuba
        { alpha2: 'CY' }, // Cyprus
        { alpha2: 'CZ' }, // Czech Republic
        { alpha2: 'DK' }, // Denmark
        { alpha2: 'DJ' }, // Djibouti
        { alpha2: 'DM' }, // Dominica
        { alpha2: 'DO' }, // Dominican Republic
        { alpha2: 'EC' }, // Ecuador
        { alpha2: 'EG' }, // Egypt
        { alpha2: 'SV' }, // El Salvador
        { alpha2: 'GQ' }, // Equatorial Guinea
        { alpha2: 'ER' }, // Eritrea
        { alpha2: 'EE' }, // Estonia
        { alpha2: 'ET' }, // Ethiopia
        { alpha2: 'FK' }, // Falkland Islands (Malvinas)
        { alpha2: 'FO' }, // Faroe Islands
        { alpha2: 'FJ' }, // Fiji
        { alpha2: 'FI' }, // Finland
        { alpha2: 'FR' }, // France
        { alpha2: 'GF' }, // French Guiana
        { alpha2: 'PF' }, // French Polynesia
        { alpha2: 'TF' }, // French Southern Territories
        { alpha2: 'GA' }, // Gabon
        { alpha2: 'GM' }, // Gambia
        { alpha2: 'GE' }, // Georgia
        { alpha2: 'DE' }, // Germany
        { alpha2: 'GH' }, // Ghana
        { alpha2: 'GI' }, // Gibraltar
        { alpha2: 'GR' }, // Greece
        { alpha2: 'GL' }, // Greenland
        { alpha2: 'GD' }, // Grenada
        { alpha2: 'GP' }, // Guadeloupe
        { alpha2: 'GU' }, // Guam
        { alpha2: 'GT' }, // Guatemala
        { alpha2: 'GG' }, // Guernsey
        { alpha2: 'GN' }, // Guinea
        { alpha2: 'GW' }, // Guinea-Bissau
        { alpha2: 'GY' }, // Guyana
        { alpha2: 'HT' }, // Haiti
        { alpha2: 'HM' }, // Heard Island & Mcdonald Islands
        { alpha2: 'VA' }, // Holy See (Vatican City State)
        { alpha2: 'HN' }, // Honduras
        { alpha2: 'HK' }, // Hong Kong
        { alpha2: 'HU' }, // Hungary
        { alpha2: 'IS' }, // Iceland
        { alpha2: 'IN' }, // India
        { alpha2: 'ID' }, // Indonesia
        { alpha2: 'IR' }, // Iran, Islamic Republic Of
        { alpha2: 'IQ' }, // Iraq
        { alpha2: 'IE' }, // Ireland
        { alpha2: 'IM' }, // Isle Of Man
        { alpha2: 'IL' }, // Israel
        { alpha2: 'IT' }, // Italy
        { alpha2: 'JM' }, // Jamaica
        { alpha2: 'JP' }, // Japan
        { alpha2: 'JE' }, // Jersey
        { alpha2: 'JO' }, // Jordan
        { alpha2: 'KZ' }, // Kazakhstan
        { alpha2: 'KE' }, // Kenya
        { alpha2: 'KI' }, // Kiribati
        { alpha2: 'KR' }, // Korea
        { alpha2: 'KP' }, // North Korea
        { alpha2: 'KW' }, // Kuwait
        { alpha2: 'KG' }, // Kyrgyzstan
        { alpha2: 'LA' }, // Lao People"S Democratic Republic
        { alpha2: 'LV' }, // Latvia
        { alpha2: 'LB' }, // Lebanon
        { alpha2: 'LS' }, // Lesotho
        { alpha2: 'LR' }, // Liberia
        { alpha2: 'LY' }, // Libyan Arab Jamahiriya
        { alpha2: 'LI' }, // Liechtenstein
        { alpha2: 'LT' }, // Lithuania
        { alpha2: 'LU' }, // Luxembourg
        { alpha2: 'MO' }, // Macao
        { alpha2: 'MK' }, // Macedonia
        { alpha2: 'MG' }, // Madagascar
        { alpha2: 'MW' }, // Malawi
        { alpha2: 'MY' }, // Malaysia
        { alpha2: 'MV' }, // Maldives
        { alpha2: 'ML' }, // Mali
        { alpha2: 'MT' }, // Malta
        { alpha2: 'MH' }, // Marshall Islands
        { alpha2: 'MQ' }, // Martinique
        { alpha2: 'MR' }, // Mauritania
        { alpha2: 'MU' }, // Mauritius
        { alpha2: 'YT' }, // Mayotte
        { alpha2: 'MX' }, // Mexico
        { alpha2: 'FM' }, // Micronesia, Federated States Of
        { alpha2: 'MD' }, // Moldova
        { alpha2: 'MC' }, // Monaco
        { alpha2: 'MN' }, // Mongolia
        { alpha2: 'ME' }, // Montenegro
        { alpha2: 'MS' }, // Montserrat
        { alpha2: 'MA' }, // Morocco
        { alpha2: 'MZ' }, // Mozambique
        { alpha2: 'MM' }, // Myanmar
        { alpha2: 'NA' }, // Namibia
        { alpha2: 'NR' }, // Nauru
        { alpha2: 'NP' }, // Nepal
        { alpha2: 'NL' }, // Netherlands
        { alpha2: 'AN' }, // Netherlands Antilles
        { alpha2: 'NC' }, // New Caledonia
        { alpha2: 'NZ' }, // New Zealand
        { alpha2: 'NI' }, // Nicaragua
        { alpha2: 'NE' }, // Niger
        { alpha2: 'NG' }, // Nigeria
        { alpha2: 'NU' }, // Niue
        { alpha2: 'NF' }, // Norfolk Island
        { alpha2: 'MP' }, // Northern Mariana Islands
        { alpha2: 'NO' }, // Norway
        { alpha2: 'OM' }, // Oman
        { alpha2: 'PK' }, // Pakistan
        { alpha2: 'PW' }, // Palau
        { alpha2: 'PS' }, // Palestinian Territory, Occupied
        { alpha2: 'PA' }, // Panama
        { alpha2: 'PG' }, // Papua New Guinea
        { alpha2: 'PY' }, // Paraguay
        { alpha2: 'PE' }, // Peru
        { alpha2: 'PH' }, // Philippines
        { alpha2: 'PN' }, // Pitcairn
        { alpha2: 'PL' }, // Poland
        { alpha2: 'PT' }, // Portugal
        { alpha2: 'PR' }, // Puerto Rico
        { alpha2: 'QA' }, // Qatar
        { alpha2: 'RE' }, // Reunion
        { alpha2: 'RO' }, // Romania
        { alpha2: 'RW' }, // Rwanda
        { alpha2: 'BL' }, // Saint Barthelemy
        { alpha2: 'SH' }, // Saint Helena
        { alpha2: 'KN' }, // Saint Kitts And Nevis
        { alpha2: 'LC' }, // Saint Lucia
        { alpha2: 'MF' }, // Saint Martin
        { alpha2: 'PM' }, // Saint Pierre And Miquelon
        { alpha2: 'VC' }, // Saint Vincent And Grenadines
        { alpha2: 'WS' }, // Samoa
        { alpha2: 'SM' }, // San Marino
        { alpha2: 'ST' }, // Sao Tome And Principe
        { alpha2: 'SA' }, // Saudi Arabia
        { alpha2: 'SN' }, // Senegal
        { alpha2: 'RS' }, // Serbia
        { alpha2: 'SC' }, // Seychelles
        { alpha2: 'SL' }, // Sierra Leone
        { alpha2: 'SG' }, // Singapore
        { alpha2: 'SK' }, // Slovakia
        { alpha2: 'SI' }, // Slovenia
        { alpha2: 'SB' }, // Solomon Islands
        { alpha2: 'SO' }, // Somalia
        { alpha2: 'ZA' }, // South Africa
        { alpha2: 'GS' }, // South Georgia And Sandwich Isl.
        { alpha2: 'ES' }, // Spain
        { alpha2: 'LK' }, // Sri Lanka
        { alpha2: 'SD' }, // Sudan
        { alpha2: 'SR' }, // Suriname
        { alpha2: 'SJ' }, // Svalbard And Jan Mayen
        { alpha2: 'SZ' }, // Swaziland
        { alpha2: 'SE' }, // Sweden
        { alpha2: 'CH' }, // Switzerland
        { alpha2: 'SY' }, // Syrian Arab Republic
        { alpha2: 'TW' }, // Taiwan
        { alpha2: 'TJ' }, // Tajikistan
        { alpha2: 'TZ' }, // Tanzania
        { alpha2: 'TH' }, // Thailand
        { alpha2: 'TL' }, // Timor-Leste
        { alpha2: 'TG' }, // Togo
        { alpha2: 'TK' }, // Tokelau
        { alpha2: 'TO' }, // Tonga
        { alpha2: 'TT' }, // Trinidad And Tobago
        { alpha2: 'TN' }, // Tunisia
        { alpha2: 'TR' }, // Turkey
        { alpha2: 'TM' }, // Turkmenistan
        { alpha2: 'TC' }, // Turks And Caicos Islands
        { alpha2: 'TV' }, // Tuvalu
        { alpha2: 'UG' }, // Uganda
        { alpha2: 'UA' }, // Ukraine
        { alpha2: 'AE' }, // United Arab Emirates
        { alpha2: 'GB' }, // United Kingdom
        { alpha2: 'US' }, // United States
        { alpha2: 'UM' }, // United States Outlying Islands
        { alpha2: 'UY' }, // Uruguay
        { alpha2: 'UZ' }, // Uzbekistan
        { alpha2: 'VU' }, // Vanuatu
        { alpha2: 'VE' }, // Venezuela
        { alpha2: 'VN' }, // Vietnam
        { alpha2: 'VG' }, // Virgin Islands, British
        { alpha2: 'VI' }, // Virgin Islands, U.S.
        { alpha2: 'WF' }, // Wallis And Futuna
        { alpha2: 'EH' }, // Western Sahara
        { alpha2: 'YE' }, // Yemen
        { alpha2: 'ZM' }, // Zambia
        { alpha2: 'ZW' }, // Zimbabwe
      ];
      for (const val of countryData) {
        await this.countryRepository.save(
          Object.assign(new Country(), {
            alpha2: val.alpha2,
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
      where: { alpha2: newLanguage.alpha2 },
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
      where: { alpha2: newCountry.alpha2 },
    });
    if (!specialization) {
      return this.countryRepository.save(newCountry);
    }
    throw new BadRequestException(
      `Country ${newCountry} already exists in the database`,
    );
  }

  async findLanguage(id: number) {
    const language = await this.languageRepository.findOne({ where: { id } });

    if (!language) {
      throw new NotFoundException(`Language with id: ${id} is not found`);
    }

    return language;
  }

  async findSpecialization(id: number) {
    const specialization = await this.specializationRepository.findOne({
      where: { id },
    });

    if (!specialization) {
      throw new NotFoundException(`Specialization with id: ${id} is not found`);
    }

    return specialization;
  }

  async findCountry(id: number) {
    const country = await this.countryRepository.findOne({ where: { id } });

    if (!country) {
      throw new NotFoundException(`Country with id: ${id} is not found`);
    }

    return country;
  }

  async editLanguage(id: number, dto: LanguageDto) {
    const language = await this.findLanguage(id);
    language.alpha2 = dto.alpha2 ?? language.alpha2;
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
    country.alpha2 = dto.alpha2 ?? country.alpha2;
    return await this.countryRepository.save(country);
  }

  async removeLanguage(id: number) {
    const toRemove = await this.languageRepository.findOne({
      where: { id },
      relations: ['spokenLanguages', 'teachingLanguages'],
    });

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
    const toRemove = await this.specializationRepository.findOne({
      where: { id },
      relations: ['adverts'],
    });

    if (toRemove.adverts.length > 0) {
      throw new BadRequestException(
        `Specialization cannot be removed because it is used in adverts`,
      );
    }

    return await this.specializationRepository.remove(toRemove);
  }

  async removeCountry(id: number) {
    const toRemove = await this.countryRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (toRemove.user.length > 0) {
      throw new BadRequestException(
        `Country cannot be removed because it is used by users`,
      );
    }
    return await this.countryRepository.remove(toRemove);
  }

  async updateRtHash(userId: number, rt: string) {
    const hashRt = await this.hashData(rt);
    await this.usersRepository.update(userId, {
      refreshToken: hashRt,
    });
  }

  async getTokens(
    userId: number,
    email: string,
    role: string,
  ): Promise<Tokens> {
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
          role: role,
        },
        {
          secret: 'at-secret',
          expiresIn: '24h',
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
          role: role,
        },
        {
          secret: 'rt-secret',
          expiresIn: 60 * 60 * 24 * 7,
        },
      ),
    ]);
    return {
      accessToken: at,
      refreshToken: rt,
    };
  }

  async hashData(data: string) {
    const saltRounds = +process.env.SALT_FOR_BCRYPT;
    const salt = await genSalt(saltRounds);
    return await bcrypt.hash(data, salt);
  }

  compareHash(password: string, hashDataPass: string) {
    return bcrypt.compare(password, hashDataPass);
  }
}
