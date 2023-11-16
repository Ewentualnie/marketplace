import { IsNotEmpty } from 'class-validator';

export class SpecializationDto {
  @IsNotEmpty()
  specializationEn: string;

  @IsNotEmpty()
  specializationUa: string;
}
