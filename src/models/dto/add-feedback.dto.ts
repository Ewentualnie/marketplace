import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsInt, Min, Max } from 'class-validator';

export class CreateFeedback {
  @ApiProperty({ example: '1' })
  @IsNotEmpty()
  @IsInt({ message: 'Mark must be an integer.' })
  @Min(1, { message: 'Mark must be at least 1.' })
  @Max(5, { message: 'Mark cannot exceed 5.' })
  mark: number;

  @ApiProperty({ example: "You're so cool." })
  @IsNotEmpty()
  message: string;
}

export default CreateFeedback;
