import { PartialType } from '@nestjs/mapped-types';
import { User } from '../entities/user.entity';
import { Hobby } from '../entities/hobby.entity';

export class UpdateUserDto extends PartialType(User) {
  email?: string;
  firstName?: string;
  lastName?: string;
  country?: string;
  birthday?: Date;
  sex?: string;
  hobbies?: Hobby[];
}
