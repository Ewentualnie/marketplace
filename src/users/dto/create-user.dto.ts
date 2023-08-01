import { IsNotEmpty, IsEmail } from 'class-validator';
import { IsValidEmail } from 'src/auth/decorators/email_validator';
import { IsValidName } from 'src/auth/decorators/name-validator';
import { IsValidPassword } from 'src/auth/decorators/pass-validator';

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
