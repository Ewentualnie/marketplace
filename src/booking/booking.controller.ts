import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { BookingService } from './booking.service';
import { GetCurrentUserId } from 'src/utils/decorators/get-user-id.decorator';
import AcceptBookingDto from 'src/models/dto/accept-booking.dto';
import TimeSlotsRequestDto from 'src/models/dto/timeslots-request.dto';

@Controller('booking')
export class BookingController {
  constructor(private readonly bookingservice: BookingService) {}

  @Post('')
  addBooking(
    @Body() timeslotsDto: TimeSlotsRequestDto,
    @GetCurrentUserId() userId: number,
  ) {
    return this.bookingservice.addBookings(timeslotsDto, userId);
  }

  @Post('accept')
  acceptBooking(
    @Body() acceptBookingDto: AcceptBookingDto,
    @GetCurrentUserId() studentId: number,
  ) {
    return this.bookingservice.acceptBooking(acceptBookingDto, studentId);
  }

  @Get('')
  getTeacherSchedule(@GetCurrentUserId() id: number) {
    return this.bookingservice.getTeacherSchedule(id);
  }

  @Get(':id')
  getStudentSchedule(@Param() id: number) {
    return this.bookingservice.getStudentSchedule(id);
  }
}
