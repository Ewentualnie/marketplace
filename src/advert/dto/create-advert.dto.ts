import { IsNotEmpty, IsNumber, IsPositive, Max } from 'class-validator';
import { Hobby } from '../entities/hobby.entity';
import { Language } from '../entities/language.entity';

export class CreateAdvertDto {
  @IsNotEmpty()
  shortDescription: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive({ message: 'Price must be greater than 0.' })
  @Max(9999, { message: 'Price must be less than or equal to 9999.' })
  price: number;

  imagePath: string;

  hobbies: Hobby[];

  @IsNotEmpty()
  spokenLanguages: Language[];

  @IsNotEmpty()
  teachingLanguages: Language[];
}
