import { PartialType } from '@nestjs/mapped-types';
import { Advert } from '../advert.entity';
import { Language } from '../language.entity';

export class UpdateAdvertDto extends PartialType(Advert) {
  description?: string;
  imagePath?: string;
  spokenLanguages?: Language[];
  teachingLanguages?: Language[];
}
