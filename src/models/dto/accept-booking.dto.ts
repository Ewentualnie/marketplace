import { IsNotEmpty, IsNumber } from 'class-validator';

export class AcceptBookingDto {
  @IsNotEmpty()
  @IsNumber()
  bookingId: number;

  @IsNotEmpty()
  @IsNumber()
  languageId: number;
}

export default AcceptBookingDto;
