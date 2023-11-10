import { IsNotEmpty, IsNumber, IsPositive, Max } from 'class-validator';
import { Language } from '../language.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateAdvertDto {
  @ApiProperty()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ type: Number })
  @IsNotEmpty()
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @IsPositive({ message: 'Price must be greater than 0.' })
  @Max(9999, { message: 'Price must be less than or equal to 9999.' })
  price: number;

  @ApiProperty({ type: 'string', format: 'binary' })
  imagePath: Express.Multer.File;

  @ApiProperty({ type: [Language] })
  @IsNotEmpty()
  spokenLanguages: Language[];

  @ApiProperty({ type: [Language] })
  @IsNotEmpty()
  teachingLanguages: Language[];
}
