import { Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';
import { IsTimeSlotsValid } from 'src/utils/validators/timeslots_validator';
import { IsUniqueTimeSlots } from 'src/utils/validators/unique_timeslots_validator';
import TimeSlot from '../timeslot.entity';

export class TimeSlotsRequestDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TimeSlot)
  @IsTimeSlotsValid()
  @IsUniqueTimeSlots()
  timeslots: TimeSlot[];
}

export default TimeSlotsRequestDto;
