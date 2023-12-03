export class UpdateUserDto {
  email?: string;
  firstName?: string;
  lastName?: string;
  country?: number;
  birthday?: Date;
  sex?: string;
  aboutMe?: string;
  photo?: File;
}
