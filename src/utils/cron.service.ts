import { Injectable, OnModuleInit } from '@nestjs/common';
import * as cron from 'node-cron';
import { BookingService } from 'src/booking/booking.service';

@Injectable()
export class CronService implements OnModuleInit {
  constructor(private readonly bookingService: BookingService) {}
  onModuleInit() {
    cron.schedule('1 0  * * *', () => {
      this.bookingService.cronDeactivateTimeslot(new Date());
    });
    console.log(
      'Initialize scheduled cron task to deactivate timeslots daily at 00:01',
    );
  }
}
