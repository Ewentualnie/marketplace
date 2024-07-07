import { plainToInstance } from 'class-transformer';
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { TimeSlotDto } from 'src/models/dto/create-timeslot.dto';

@ValidatorConstraint({ async: false })
class IsTimeSlotsValidConstraint implements ValidatorConstraintInterface {
  validate(timeslots: TimeSlotDto[]) {
    return plainToInstance(TimeSlotDto, timeslots).every((timeslot) => {
      if (!timeslot.start || !timeslot.end) {
        return false;
      }
      return (
        timeslot.start.toDateString() === timeslot.end.toDateString() &&
        timeslot.start.getTime() < timeslot.end.getTime() &&
        timeslot.end.getTime() - timeslot.start.getTime() >= 60 * 60 * 1000 &&
        timeslot.start.getMinutes() == 0 &&
        timeslot.start.getSeconds() == 0 &&
        timeslot.end.getMinutes() == 0 &&
        timeslot.end.getSeconds() == 0
      );
    });
  }

  defaultMessage() {
    return (
      'All time slots must have start and end dates on the same day,' +
      ' start time must be before end time,' +
      ' and the time difference must be at least 1 hour,' +
      ' start and end must be expressed in hours without minutes and seconds'
    );
  }
}

export function IsTimeSlotsValid(validationOptions?: ValidationOptions) {
  return function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsTimeSlotsValidConstraint,
    });
  };
}
