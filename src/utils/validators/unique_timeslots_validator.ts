import { plainToInstance } from 'class-transformer';
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import TimeSlotDto from 'src/models/dto/create-timeslot.dto';

@ValidatorConstraint({ async: false })
class IsUniqueTimeSlotsConstraint implements ValidatorConstraintInterface {
  validate(timeSlots: TimeSlotDto[]) {
    const isValidTimeSlot = (timeslot: TimeSlotDto): boolean => {
      return (
        timeslot.start.toDateString() === timeslot.end.toDateString() &&
        timeslot.start.getTime() < timeslot.end.getTime() &&
        timeslot.end.getTime() - timeslot.start.getTime() >= 60 * 60 * 1000 &&
        timeslot.start.getMinutes() === 0 &&
        timeslot.end.getMinutes() === 0
      );
    };

    return (
      timeSlots
        .map((slot) => plainToInstance(TimeSlotDto, slot))
        .sort((a, b) => a.start.getTime() - b.start.getTime())
        .filter((slot, i, arr) => {
          if (!isValidTimeSlot(slot)) {
            return true;
          }
          if (i > 0) {
            const prevSlot = arr[i - 1];
            if (prevSlot.end.getTime() > slot.start.getTime()) {
              return true;
            }
          }

          return false;
        }).length === 0
    );
  }

  defaultMessage() {
    return (
      'Each timeslot instance must meet the following conditions: ' +
      '1. is within one day; ' +
      '2. start time must be before end time; ' +
      '3. start and end must be expressed in hours without minutes; ' +
      '4. lasting at least 1 hour; ' +
      '5. all timeslots should not overlap.'
    );
  }
}

export function IsUniqueTimeSlots(validationOptions?: ValidationOptions) {
  return function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsUniqueTimeSlotsConstraint,
    });
  };
}
