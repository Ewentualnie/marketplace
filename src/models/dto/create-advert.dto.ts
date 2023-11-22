import { IsNotEmpty, IsNumber, IsPositive, Max } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateAdvertDto {
  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  @IsPositive({ message: 'Price must be greater than 0.' })
  @Max(9999, { message: 'Price must be less than or equal to 9999.' })
  price: number;

  image: any;

  @IsNotEmpty()
  spokenLanguages: string;

  @IsNotEmpty()
  teachingLanguages: string;

  updateUser: string;
}
