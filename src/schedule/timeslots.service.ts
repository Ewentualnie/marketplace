import { InjectRepository } from '@nestjs/typeorm';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import TimeSlot from 'src/models/timeslot.entity';
import User from 'src/models/user.entity';
import TimeSlotsRequestDto from 'src/models/dto/timeslots-request.dto';
import { BookingService } from 'src/booking/booking.service';
import Booking from 'src/models/booking.entity';

@Injectable()
export class TimeSlotsService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    @InjectRepository(TimeSlot)
    private timeslotRepository: Repository<TimeSlot>,
    private bookingService: BookingService,
  ) {}

  async getTimeSlots(userId: number) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: [
        'bookingsAsTeacher',
        'bookingsAsTeacher.student',
        'bookingsAsTeacher.language',
      ],
      order: {
        bookingsAsTeacher: {
          date: 'ASC',
        },
      },
    });
    return user.bookingsAsTeacher;
  }

  async addTimeSlots(timeslotsRequestDto: TimeSlotsRequestDto, id: number) {
    let user = await this.usersRepository.findOne({
      where: { id },
      relations: ['timeslots'],
    });
    if (!user) {
      throw new BadRequestException(`User with id ${id} does not exist`);
    }

    const existingDates = user.timeslots.map((slot) =>
      slot.start.toDateString(),
    );

    const uniqueTimeSlots = timeslotsRequestDto.timeslots.filter((slot) => {
      const startDateString = new Date(slot.start).toDateString();
      if (existingDates.includes(startDateString)) {
        return false;
      }
      existingDates.push(startDateString);
      return true;
    });

    const savedSlots = await this.timeslotRepository.save(uniqueTimeSlots);
    user.timeslots.push(...savedSlots);
    user = await this.usersRepository.save(user);
    return user.timeslots;
  }

  async addBookings(timeslotsRequestDto: TimeSlotsRequestDto, id: number) {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['advert', 'bookingsAsStudent', 'bookingsAsTeacher'],
    });
    if (!user) {
      throw new BadRequestException(`User with id ${id} does not exist`);
    }
    if (!user.advert) {
      throw new BadRequestException(
        `Only user with advert can claim timeslots`,
      );
    }
    const bookings: Booking[] = [];

    for (const slot of timeslotsRequestDto.timeslots) {
      const startTime = new Date(slot.start);
      const endTime = new Date(slot.end);
      const dates: Date[] = [];

      const currentTime = new Date(startTime);
      while (currentTime < endTime) {
        dates.push(new Date(currentTime));

        bookings.push(
          await this.bookingService.createBooking(new Date(currentTime), user),
        );

        currentTime.setHours(currentTime.getHours() + 1);
        if (currentTime >= endTime) break;
      }
    }
    return bookings;
  }
}
