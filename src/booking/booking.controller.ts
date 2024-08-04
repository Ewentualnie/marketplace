import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { BookingService } from './booking.service';
import { GetCurrentUserId } from 'src/utils/decorators/get-user-id.decorator';
import { DateValidationPipe } from 'src/utils/validators/date_validator';
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
  getTeacherSchedule(
    @GetCurrentUserId() id: number,
    @Query('from', DateValidationPipe) from?: Date,
    @Query('to', DateValidationPipe) to?: Date,
  ) {
    return this.bookingservice.getSchedule(id, from, to);
  }

  @Get(':id')
  getStudentSchedule(
    @Param('id', ParseIntPipe) id: number,
    @Query('from', DateValidationPipe) from?: Date,
    @Query('to', DateValidationPipe) to?: Date,
  ) {
    return this.bookingservice.getSchedule(id, from, to, false);
  }

  @Patch(':id')
  deactivateTimeslot(
    @Param('id', ParseIntPipe) id: number,
    @GetCurrentUserId() userId: number,
  ) {
    return this.bookingservice.deactivateTimeslot(userId, id);
  }
}
