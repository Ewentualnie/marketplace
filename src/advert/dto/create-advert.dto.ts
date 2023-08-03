import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateAdvertDto {
  @IsNotEmpty()
  shortDescription: string;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  imagePath: string;
}
