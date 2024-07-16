import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class DateValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (!value) {
      return value;
    }

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(value)) {
      throw new BadRequestException(
        `Invalid date format for ${metadata.data}: ${value}. Expected format: YYYY-MM-DD`,
      );
    }

    const date = new Date(value);
    console.log(`${metadata.data}`);
    console.log(date);
    if (isNaN(date.getTime())) {
      throw new BadRequestException(
        `Invalid date format for ${metadata.data}: ${value}`,
      );
    }
    return date;
  }
}
