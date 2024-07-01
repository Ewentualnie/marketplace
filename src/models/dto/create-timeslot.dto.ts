import { Type } from 'class-transformer';
import { IsISO8601 } from 'class-validator';

export class TimeSlotDto {
  @IsISO8601()
  @Type(() => Date)
  start: Date;

  @IsISO8601()
  @Type(() => Date)
  end: Date;
}

export default TimeSlotDto;
