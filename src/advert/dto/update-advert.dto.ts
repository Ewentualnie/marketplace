import { PartialType } from '@nestjs/mapped-types';
import { Advert } from '../entities/advert.entity';
import { Language } from '../entities/language.entity';

export class UpdateAdvertDto extends PartialType(Advert) {
  description?: string;
  imagePath?: string;
  spokenLanguages?: Language[];
  teachingLanguages?: Language[];
}
