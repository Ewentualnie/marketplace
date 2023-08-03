import { IsNotEmpty } from 'class-validator';

export class CreateAdvertDto {
  @IsNotEmpty()
  shortDescription: string;

  @IsNotEmpty()
  price: number;

  imagePath: string;
}
