import { InjectRepository } from '@nestjs/typeorm';
import { Between, LessThan, Repository } from 'typeorm';
import { BadRequestException, Injectable } from '@nestjs/common';
import { UtilsService } from 'src/utils/utils.service';
import { UsersService } from 'src/users/users.service';
import User from 'src/models/user.entity';
import Booking from 'src/models/booking.entity';
import AcceptBookingDto from 'src/models/dto/accept-booking.dto';
import TimeSlotsRequestDto from 'src/models/dto/timeslots-request.dto';
import { ChatService } from 'src/utils/chat.service';

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
    private utilService: UtilsService,
    private userService: UsersService,
    private chatService: ChatService,
  ) {}

  async addBookings(timeslotsRequestDto: TimeSlotsRequestDto, id: number) {
    const teacher = await this.userService.getTeacherById(id);

    if (!teacher.advert) {
      throw new BadRequestException(
        `Only user with advert can claim timeslots`,
      );
    }

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
    const language = await this.utilService.findLanguage(
      acceptBooking.languageId,
    );

    if (booking.teacher.id == studentId) {
      throw new BadRequestException(`User cannot accept his own bookings`);
    }

    if (
      !booking.advert.teachingLanguages.some((lang) => lang.id === language.id)
    ) {
      throw new BadRequestException(
        `Teacher ${booking.teacher.firstName} ${booking.teacher.lastName} dont teach ${language.languageEn}!`,
      );
    }

    if (acceptBooking.info) {
      this.chatService.sendMessage(
        {
          message:
            `Hi I am ${studentToSave.firstName} ${studentToSave.lastName}, ` +
            `I am from ${acceptBooking.info.from}, ` +
            `my level of ${language} is ${acceptBooking.info.level}. ` +
            `I want to get our first lesson on ${booking.date}`,
        },
        studentId,
        booking.teacher.id,
      );
    }

    booking.student = await this.userService.getUserById(studentToSave.id);
    booking.language = language;
    booking.isBooked = true;
    studentToSave.bookingsAsStudent.push(booking);
    await this.userService.saveUser(studentToSave);

    return await this.bookingRepository.save(booking);
  }

  async getBookingIfNotBooked(id: number): Promise<Booking> {
    const booking = await this.bookingRepository.findOne({
      where: { id },
      relations: ['teacher', 'language', 'advert.teachingLanguages'],
    });
    if (!booking) {
      throw new BadRequestException(`Timeslot with id ${id} not found`);
    }
    if (booking.isBooked) {
      throw new BadRequestException(`Timeslot with id ${id} is booked`);
    }
    if (!booking.isActive) {
      throw new BadRequestException(`Timeslot with id ${id} is inactive`);
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
    userId: number,
    from: Date,
    to: Date,
    isTeacher = true,
  ): Promise<Booking[]> {
    const condition: any = {
      [isTeacher ? 'teacher' : 'student']: { id: userId },
    };

    if (from && to) {
      condition.date = Between(from, to);
    }
    return await this.bookingRepository.find({
      where: condition,
      relations: ['advert', 'language', isTeacher ? 'student' : 'teacher'],
      order: { date: 'ASC' },
    });
  }

  async deactivateTimeslot(userId: number, id: number) {
    const teacher = await this.userService.getTeacherById(userId);
    const timeslot = await this.bookingRepository.findOne({
      where: { id },
      relations: ['teacher'],
    });
    if (!timeslot) {
      throw new BadRequestException(`Timeslot with id ${id} not found`);
    }
    if (!teacher.advert) {
      throw new BadRequestException(
        `Only user with advert can claim timeslots`,
      );
    }
    if (teacher.id != timeslot.teacher.id) {
      throw new BadRequestException(
        `Slot with id ${id} does not belong to user with id ${userId}`,
      );
    }
    timeslot.isActive = !timeslot.isActive;
    return await this.bookingRepository.save(timeslot);
  }

  async cronDeactivateTimeslot(date: Date) {
    const timeslots = await this.bookingRepository.find({
      where: { date: LessThan(date), isActive: true },
    });
    timeslots.forEach((slot) => (slot.isActive = false));
    const count = (await this.bookingRepository.save(timeslots)).length;
    console.log(
      `At ${new Date().getHours}} service deactivate ${count} timeslots`,
    );
  }

  async deleteBooking(id: number, userId: number, reason: string) {
    const booking = await this.bookingRepository.findOne({
      where: { id },
      relations: ['teacher', 'student'],
    });
    const teacher = await this.userService.getTeacherById(booking.teacher.id);
    const student = await this.userService.getStudentById(booking.student.id);

    if (teacher.id != userId || student.id != userId) {
      throw new BadRequestException(
        'User cannot delete a booking other than his own',
      );
    }
    const isTeacherSender = userId == teacher.id;

    this.chatService.sendMessage(
      {
        message: `Hi, I can't attend the lesson for a reason: ${reason}`,
      },
      userId,
      isTeacherSender ? booking.teacher.id : booking.student.id,
    );

    teacher.bookingsAsTeacher = teacher.bookingsAsTeacher.filter(
      (b) => b.id !== booking.id,
    );
    student.bookingsAsStudent = student.bookingsAsStudent.filter(
      (b) => b.id !== booking.id,
    );

    await this.userService.saveUser([teacher, student]);

    return await this.bookingRepository.remove(booking);
  }
}
