import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { BadRequestException, Injectable } from '@nestjs/common';
import { UtilsService } from 'src/utils/utils.service';
import { UsersService } from 'src/users/users.service';
import User from 'src/models/user.entity';
import Booking from 'src/models/booking.entity';
import AcceptBookingDto from 'src/models/dto/accept-booking.dto';
import TimeSlotsRequestDto from 'src/models/dto/timeslots-request.dto';

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
    private utilService: UtilsService,
    private userService: UsersService,
  ) {}

  async addBookings(timeslotsRequestDto: TimeSlotsRequestDto, id: number) {
    const teacher = await this.userService.getTeacherById(id);

    for (const slot of timeslotsRequestDto.timeslots) {
      const startTime = new Date(slot.start);
      const endTime = new Date(slot.end);
      const currentTime = new Date(startTime);
      while (currentTime < endTime) {
        const existingBooking = await this.getTeacherBookingByDate(
          teacher.id,
          currentTime,
        );
        if (!existingBooking) {
          await this.createBooking(new Date(currentTime), teacher);
        }
        currentTime.setHours(currentTime.getHours() + 1);
      }
    }
    return this.getAllTeacherBookings(teacher.id);
  }

  async createBooking(date: Date, teacher: User) {
    const booking = this.bookingRepository.create({
      teacher,
      date,
      advert: teacher.advert,
      isActive: true,
    });
    const savedBooking = await this.bookingRepository.save(booking);
    teacher.bookingsAsTeacher.push(savedBooking);
    await this.userService.saveUser(teacher);
    return savedBooking;
  }

  async acceptBooking(acceptBooking: AcceptBookingDto, studentId: number) {
    const booking = await this.getBookingIfNotBooked(acceptBooking.bookingId);
    const studentToSave = await this.userService.getStudentById(studentId);

    studentToSave.bookingsAsStudent.push(booking);
    await this.userService.saveUser(studentToSave);

    booking.student = await this.userService.getUserById(studentToSave.id);
    booking.language = await this.utilService.findLanguage(
      acceptBooking.languageId,
    );
    booking.isBooked = true;

    return await this.bookingRepository.save(booking);
  }

  async getBookingIfNotBooked(id: number): Promise<Booking> {
    const booking = await this.bookingRepository.findOne({
      where: { id },
      relations: ['teacher', 'language'],
    });
    if (!booking) {
      throw new BadRequestException(`Timeslot with id ${id} not found`);
    }
    if (booking.isBooked) {
      throw new BadRequestException(`Timeslot with id ${id} is booked`);
    }
    return booking;
  }

  async getTeacherBookingByDate(id: number, date: Date) {
    return await this.bookingRepository.findOne({
      where: { teacher: { id }, date },
    });
  }

  async getAllTeacherBookings(id: number): Promise<Booking[]> {
    return await this.bookingRepository.find({
      where: { teacher: { id } },
    });
  }

  async getSchedule(
    id: number,
    from: Date,
    to: Date,
    isTeacher = true,
  ): Promise<Booking[]> {
    const condition: any = {
      student: { id },
    };
    if (from && to) {
      condition.date = Between(from, to);
    }
    return await this.bookingRepository.find({
      where: condition,
      relations: ['advert', 'language', isTeacher ? 'teacher' : 'student'],
      order: { date: 'ASC' },
    });
  }
}
