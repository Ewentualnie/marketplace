import { IsNotEmpty, IsInt, Min, Max } from 'class-validator';

export class CreateFeedback {
  @IsNotEmpty()
  @IsInt({ message: 'Mark must be an integer.' })
  @Min(1, { message: 'Mark must be at least 1.' })
  @Max(5, { message: 'Mark cannot exceed 5.' })
  mark: number;

  @IsNotEmpty()
  message: string;
}
