import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  email: string;
  name: string;
  surname: string;
  residence?: string;
  languages?: string;
  expirience?: string;
  preview?: string;
  workingDays?: Date;
  workingHours?: string;
}
