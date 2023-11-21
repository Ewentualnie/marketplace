import { Language } from '../language.entity';

export class UpdateAdvertDto {
  price?: number;
  description?: string;
  imagePath?: string;
  spokenLanguages?: Language[];
  teachingLanguages?: Language[];
}
