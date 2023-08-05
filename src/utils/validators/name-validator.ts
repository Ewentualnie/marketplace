import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'isValidName', async: false })
export class IsValidNameConstraint implements ValidatorConstraintInterface {
  validate(value: string) {
    if (!value) return false;
    return /^.{2,20}$/.test(value);
  }

  defaultMessage() {
    return 'Name must have at least 2 and at most 20 characters.';
  }
}

export function IsValidName(validationOptions?: ValidationOptions) {
  return function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsValidNameConstraint,
    });
  };
}
