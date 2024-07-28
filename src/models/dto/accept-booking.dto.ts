import { IsNotEmpty, IsNumber } from 'class-validator';

export class AcceptBookingDto {
  @IsNotEmpty()
  @IsNumber()
  bookingId: number;

  @IsNotEmpty()
  @IsNumber()
  languageId: number;
  info?: { level: string; from: string; motherTongue: string };
}

export default AcceptBookingDto;
