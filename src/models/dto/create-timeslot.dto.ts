import { IsISO8601 } from 'class-validator';

export class TimeSlotDto {
  @IsISO8601()
  start: Date;

  @IsISO8601()
  end: Date;
}
