import { Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';
import { IsUniqueTimeSlots } from 'src/utils/validators/unique_timeslots_validator';
import TimeSlot from '../timeslot.entity';

export class TimeSlotsRequestDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TimeSlot)
  @IsUniqueTimeSlots()
  timeslots: TimeSlot[];
}

export default TimeSlotsRequestDto;
