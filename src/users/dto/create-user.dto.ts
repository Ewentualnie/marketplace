import { IsNotEmpty, IsEmail } from 'class-validator';
import { IsValidEmail } from 'src/utils/validators/email_validator';
import { IsValidName } from 'src/utils/validators/name-validator';
import { IsValidPassword } from 'src/utils/validators/pass-validator';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  @IsValidEmail()
  email: string;

  @IsNotEmpty()
  @IsValidPassword()
  password: string;

  @IsNotEmpty()
  @IsValidName()
  name: string;
}
