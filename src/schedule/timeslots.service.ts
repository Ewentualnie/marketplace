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
}
