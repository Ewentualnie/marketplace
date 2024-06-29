import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import CreateScheduleDto from 'src/models/dto/create-schedule.dto';
import Schedule from 'src/models/schedule.entity';
import TimeSlot from 'src/models/timeslot.entity';
import User from 'src/models/user.entity';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    @InjectRepository(TimeSlot)
    private timeslotRepository: Repository<TimeSlot>,
    @InjectRepository(Schedule)
    private scheduleRepository: Repository<Schedule>,
  ) {}

  async getSchedule(userId: number) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['schedule.timeslots', 'schedule.user'],
    });
    if (user.schedule) {
      return user.schedule;
    }
    return 'User does not have a schedule yet';
  }

  async addSchedule(scheduleDto: CreateScheduleDto, id: number) {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['schedule'],
    });

    if (user.schedule) {
      throw new BadRequestException(
        `User with id ${user.id} already has a schedule!`,
      );
    }

    let schedule = this.scheduleRepository.create({
      user,
    });
    schedule = await this.scheduleRepository.save(schedule);

    let slots = [];
    for (const slot of scheduleDto.timeslots) {
      slots.push(
        this.timeslotRepository.create({
          ...slot,
          schedule,
        }),
      );
    }
    slots = await this.timeslotRepository.save(slots);
    schedule.timeslots = slots;
    user.schedule = schedule;
    await this.usersRepository.save(user);
    return await this.scheduleRepository.save(schedule);
  }
}
