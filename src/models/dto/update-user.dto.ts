import { Hobby } from '../hobby.entity';

export class UpdateUserDto {
  email?: string;
  firstName?: string;
  lastName?: string;
  countryName?: string;
  birthday?: string;
  sex?: string;
  hobbies?: Hobby[];
  photo?: File;
}
