import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';
import { IsValidEmail } from 'src/utils/validators/email_validator';

export class UpdateUserEmailDto {
  @ApiProperty({ example: 'test1@example.com' })
  @IsEmail()
  @IsValidEmail()
  email: string;
}

export default UpdateUserEmailDto;
