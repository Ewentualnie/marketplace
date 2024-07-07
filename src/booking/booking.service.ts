import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BadRequestException, Injectable } from '@nestjs/common';
import User from 'src/models/user.entity';
import Booking from 'src/models/booking.entity';
import { UtilsService } from 'src/utils/utils.service';
import AcceptBookingDto from 'src/models/dto/accept-booking.dto';

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
    private utilService: UtilsService,
  ) {}

  async createBooking(date: Date, teacher: User) {
    const booking = this.bookingRepository.create({
      teacher,
      date,
      advert: teacher.advert,
      isActive: true,
    });
    const savedBooking = await this.bookingRepository.save(booking);
    teacher.bookingsAsTeacher.push(savedBooking);
    await this.usersRepository.save(teacher);
    return savedBooking;
  }

  async acceptBooking(acceptBooking: AcceptBookingDto, studentId: number) {
    const booking = await this.bookingRepository.findOne({
      where: { id: acceptBooking.bookingId },
      relations: ['teacher'],
    });
    if (!booking) {
      throw new BadRequestException(`Timeslot with id ${booking.id} not found`);
    }
    if (booking.isBooked) {
      throw new BadRequestException(`Timeslot with id ${booking.id} is booked`);
    }

    const student = await this.usersRepository.findOne({
      where: { id: studentId },
      relations: ['bookingsAsStudent'],
    });
    if (!student) {
      throw new BadRequestException(`User with id ${studentId} is not found`);
    }
    booking.student = student;
    booking.language = await this.utilService.findLanguage(
      acceptBooking.languageId,
    );
    booking.isBooked = true;
    // student.bookingsAsStudent.push(booking);
    await this.usersRepository.save(student);
    return await this.bookingRepository.save(booking);
  }
}
