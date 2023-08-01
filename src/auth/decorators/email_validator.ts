import { Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationOptions,
  registerDecorator,
} from 'class-validator';

@ValidatorConstraint({ name: 'isValidEmail', async: false })
@Injectable()
export class IsValidEmailValidator implements ValidatorConstraintInterface {
  validate(email: string) {
    const isValidFormat =
      /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/i.test(email);

    return isValidFormat;
  }

  defaultMessage() {
    return 'Email $value has an invalid format.';
  }
}

export function IsValidEmail(validationOptions?: ValidationOptions) {
  return function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsValidEmailValidator,
    });
  };
}
