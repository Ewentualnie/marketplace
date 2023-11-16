import { IsNotEmpty } from 'class-validator';

export class LanguageDto {
  @IsNotEmpty()
  languageEn: string;

  @IsNotEmpty()
  languageUa: string;
}
