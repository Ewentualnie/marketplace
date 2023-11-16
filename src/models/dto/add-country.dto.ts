import { IsNotEmpty } from 'class-validator';

export class CountryDto {
  @IsNotEmpty()
  countryEn: string;

  @IsNotEmpty()
  countryUa: string;
}
