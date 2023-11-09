import { IsNotEmpty } from 'class-validator';

export class LanguageDto {
  @IsNotEmpty()
  language: string;
}
