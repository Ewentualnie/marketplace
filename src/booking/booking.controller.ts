import { Body, Controller, Post } from '@nestjs/common';
import { BookingService } from './booking.service';
import { GetCurrentUserId } from 'src/utils/decorators/get-user-id.decorator';
import AcceptBookingDto from 'src/models/dto/accept-booking.dto';

@Controller('booking')
export class BookingController {
  constructor(private readonly bookingservice: BookingService) {}

  @Post('')
  acceptBooking(
    @Body() acceptBookingDto: AcceptBookingDto,
    @GetCurrentUserId() studentId: number,
  ) {
    return this.bookingservice.acceptBooking(acceptBookingDto, studentId);
  }
}
