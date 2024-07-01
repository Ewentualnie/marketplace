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
    return plainToInstance(TimeSlotDto, timeSlots).reduce(
      (acc, timeSlot) => {
        if (acc.seenDates.includes(timeSlot.start.toDateString())) {
          acc.isValid = false;
        } else {
          acc.seenDates.push(timeSlot.start.toDateString());
        }
        return acc;
      },
      { seenDates: [], isValid: true },
    ).isValid;
  }

  defaultMessage() {
    return 'Each day can have only one timeslot.';
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
