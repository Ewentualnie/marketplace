import { IsNotEmpty } from 'class-validator';

export class CreateAdvertDto {
  shortDescription: string;

  @IsNotEmpty()
  price: number;

  imagePath: string;
}
