import { Transform, Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, Matches } from 'class-validator';

export class CreateAdvertDto {
  @IsNotEmpty()
  shortDescription: string;

  @IsNotEmpty()
  @IsNumber()
  @Matches(/^(?!-0?$)(?!0*$)(\d{1,4}(\.\d{1,2})?|\.\d{1,2})$/, {
    message:
      'Invalid price format. Price must be a number following pattern  XXXX.XX or XXXXX more then 0.',
  })
  @Transform(({ value }) => parseFloat(value))
  @Type(() => Number)
  price: number;

  imagePath: string;
}
