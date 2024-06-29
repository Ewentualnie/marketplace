import { IsNotEmpty, IsString, Length } from 'class-validator';
import exp from 'constants';

export class LanguageDto {
  @IsNotEmpty()
  @Length(2, 2, { message: 'Field must be 2 characters long' })
  @IsString({ message: 'Field must be a string' })
  alpha2: string;

  @IsNotEmpty()
  languageEn: string;

  @IsNotEmpty()
  languageUa: string;
}

export default LanguageDto;
