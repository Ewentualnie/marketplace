import { InjectRepository } from '@nestjs/typeorm';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import TimeSlot from 'src/models/timeslot.entity';
import User from 'src/models/user.entity';
import TimeSlotsRequestDto from 'src/models/dto/timeslots-request.dto';

@Injectable()
export class TimeSlotsService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    @InjectRepository(TimeSlot)
    private timeslotRepository: Repository<TimeSlot>,
  ) {}

  async getTimeSlots(userId: number) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['timeslots'],
    });
    if (user.timeslots) {
      return user.timeslots;
    }
  }

  async addTimeSlots(timeslotsRequestDto: TimeSlotsRequestDto, id: number) {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['timeslots'],
    });
    if (!user) {
      throw new BadRequestException(`User with id ${id} does not exist`);
    }
    const timeslots: TimeSlot[] = [];
    for (const timeslot of timeslotsRequestDto.timeslots) {
      timeslots.push(
        this.timeslotRepository.create({
          start: timeslot.start,
          end: timeslot.end,
          user,
        }),
      );
    }
    const savedSlots = await this.timeslotRepository.save(timeslots);
    user.timeslots.push(...savedSlots);
    await this.usersRepository.save(user);
    return timeslots;
  }
}
