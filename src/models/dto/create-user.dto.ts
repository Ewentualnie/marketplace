import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail } from 'class-validator';
import { IsValidEmail } from 'src/utils/validators/email_validator';
import { IsValidName } from 'src/utils/validators/name-validator';
import { IsValidPassword } from 'src/utils/validators/pass-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'test1@example.com' })
  @IsEmail()
  @IsNotEmpty()
  @IsValidEmail()
  email: string;

  @ApiProperty({ example: 'xxxxxxx' })
  @IsNotEmpty()
  @IsValidPassword()
  password: string;

  @ApiProperty({ example: 'Boris' })
  @IsNotEmpty()
  @IsValidName()
  firstName: string;
}
