import { IsNotEmpty } from 'class-validator';
import { IsValidPrice } from 'src/utils/validators/price-validator';

export class CreateAdvertDto {
  @IsNotEmpty()
  shortDescription: string;

  @IsNotEmpty()
  @IsValidPrice()
  price: number;

  imagePath: string;
}
