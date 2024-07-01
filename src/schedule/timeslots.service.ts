import { InjectRepository } from '@nestjs/typeorm';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import TimeSlotsRequestDto from 'src/models/dto/add-timeslots.dto';
import TimeSlot from 'src/models/timeslot.entity';
import User from 'src/models/user.entity';
import TimeSlots from 'src/models/user-slots.entity';

@Injectable()
export class TimeSlotsService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    @InjectRepository(TimeSlot)
    private timeslotRepository: Repository<TimeSlot>,
    @InjectRepository(TimeSlots)
    private slotsRepository: Repository<TimeSlots>,
  ) {}

  async getTimeSlots(userId: number) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['slots.timeslots', 'slots.user'],
    });
    if (user.slots) {
      return user.slots;
    }
    return 'User does not have a schedule yet';
  }

  async addTimeSlots(timeslotsRequestDto: TimeSlotsRequestDto, id: number) {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['slots'],
    });
    if (user.slots) {
      throw new BadRequestException(
        `User with id ${user.id} already has a schedule!`,
      );
    }
    let slots = this.slotsRepository.create({
      user,
    });
    slots = await this.slotsRepository.save(slots);
    let timeslots = [];
    for (const slot of timeslotsRequestDto.timeslots) {
      timeslots.push(
        this.timeslotRepository.create({
          ...slot,
          schedule: slots,
        }),
      );
    }
    timeslots = await this.timeslotRepository.save(timeslots);
    slots.timeslots = timeslots;
    user.slots = slots;
    await this.usersRepository.save(user);
    return await this.slotsRepository.save(slots);
  }

  addTimeslots(scheduleDto: TimeSlotsRequestDto, id: number) {
    return id;
  }
}
