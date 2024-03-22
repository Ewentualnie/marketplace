import { IsNotEmpty, IsNumber, IsPositive, Max } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAdvertDto {
  @ApiProperty({ example: 'description' })
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: '100' })
  @IsNotEmpty()
  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  @IsPositive({ message: 'Price must be greater than 0.' })
  @Max(9999, { message: 'Price must be less than or equal to 9999.' })
  price: number;

  @ApiProperty({ type: 'string', format: 'binary' })
  image: any;

  @ApiProperty({ example: [1, 2] })
  @IsNotEmpty()
  spokenLanguages: string;

  @ApiProperty({ example: [1, 2] })
  @IsNotEmpty()
  teachingLanguages: string;

  @ApiProperty({
    example: {
      lastName: 'test',
      sex: 'male',
      country: 4,
      birthday: '1111-11-11',
    },
  })
  @IsNotEmpty()
  updateUser: string;

  @ApiProperty({ example: [1, 2] })
  @IsNotEmpty()
  specializations: string;
}
