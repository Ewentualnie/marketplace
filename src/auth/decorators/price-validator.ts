import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'isValidPrice', async: false })
export class IsValidPriceValidator implements ValidatorConstraintInterface {
  validate(price: string) {
    return /^\d{1,4}(\.\d{2})?$/.test(price);
  }

  defaultMessage() {
    return 'Invalid price format. Price must have a format of "XXXX" or "XXXX.XX" where X is a digit.';
  }
}

export function IsValidPrice(
  optional = false,
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [optional],
      validator: IsValidPriceValidator,
    });
  };
}
