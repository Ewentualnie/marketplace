import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'isValidPassword', async: false })
export class IsValidPasswordConstraint implements ValidatorConstraintInterface {
  validate(value: string) {
    if (!value) return false;
    return /^(?=.*[A-Z])(?=.*\d).{6,16}$/.test(value);
  }

  defaultMessage() {
    return 'Password must have at least 6 and at most 16 characters, including at least one uppercase letter and one digit.';
  }
}

export function IsValidPassword(validationOptions?: ValidationOptions) {
  return function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsValidPasswordConstraint,
    });
  };
}
