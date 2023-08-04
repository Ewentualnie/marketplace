import { IsNotEmpty } from 'class-validator';
import { IsValidPrice } from 'src/auth/decorators/price-validator';

export class CreateAdvertDto {
  @IsNotEmpty()
  shortDescription: string;

  @IsNotEmpty()
  @IsValidPrice()
  price: number;

  imagePath: string;
}
