import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CountryDto {
  @IsNotEmpty()
  @Length(2, 2, { message: 'Field must be 2 characters long' })
  @IsString({ message: 'Field must be a string' })
  alpha2: string;
}

export default CountryDto;
