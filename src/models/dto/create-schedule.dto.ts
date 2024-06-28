import { Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';
import TimeSlot from '../timeslot.entity';

export class CreateScheduleDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TimeSlot)
  timeslots: TimeSlot[];
}

export default CreateScheduleDto;
