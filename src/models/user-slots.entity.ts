import {
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import User from './user.entity';
import TimeSlot from './timeslot.entity';

@Entity({ name: 'user_slots' })
export class TimeSlots {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User, (user) => user.slots)
  @JoinColumn()
  user: User;

  @OneToMany(() => TimeSlot, (timeslot) => timeslot.schedule)
  timeslots: TimeSlot[];
}

export default TimeSlots;
