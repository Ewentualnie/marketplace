import { Language } from '../language.entity';

export class UpdateAdvertDto {
  price?: number;
  description?: string;
  imagePath?: string;
  specializations: number[];
  spokenLanguages?: Language[];
  teachingLanguages?: Language[];
}
