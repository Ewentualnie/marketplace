import { ApiProperty } from '@nestjs/swagger';
import { IsValidPassword } from 'src/utils/validators/pass-validator';

export class UpdateUserPasswordDto {
  @ApiProperty({ example: 'xxxxxxx' })
  @IsValidPassword({
    message:
      'Old password must have at least 6 and at most 16 characters, including at least one uppercase letter and one digit.',
  })
  oldPassword: string;

  @ApiProperty({ example: 'xxxxxxx' })
  @IsValidPassword({
    message:
      'New password must have at least 6 and at most 16 characters, including at least one uppercase letter and one digit.',
  })
  newPassword: string;
}

export default UpdateUserPasswordDto;
