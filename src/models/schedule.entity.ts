import {
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import User from './user.entity';
import TimeSlot from './timeslot.entity';

@Entity({ name: 'schedule' })
export class Schedule {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User, (user) => user.schedule)
  @JoinColumn()
  user: User;

  @OneToMany(() => TimeSlot, (timeslot) => timeslot.schedule)
  timeslots: TimeSlot[];
}

export default Schedule;
