import { Hobby } from '../hobby.entity';

export class UpdateUserDto {
  email?: string;
  firstName?: string;
  lastName?: string;
  country?: number;
  birthday?: Date;
  sex?: string;
  hobbies?: Hobby[];
  photo?: File;
  specializations: number[];
}
