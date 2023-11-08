import { PartialType } from '@nestjs/mapped-types';
import { User } from '../user.entity';
import { Hobby } from '../hobby.entity';

export class UpdateUserDto extends PartialType(User) {
  email?: string;
  firstName?: string;
  lastName?: string;
  country?: string;
  birthday?: Date;
  sex?: string;
  hobbies?: Hobby[];
}
