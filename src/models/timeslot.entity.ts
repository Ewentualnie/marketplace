import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import User from './user.entity';

@Entity({ name: 'timeslot' })
export class TimeSlot {
  @PrimaryGeneratedColumn()
  @Exclude()
  id: number;

  @ManyToOne(() => User, (user) => user.timeslots)
  @JoinColumn()
  @Exclude()
  user: User;

  @Column({ type: 'timestamptz' })
  start: Date;

  @Column({ type: 'timestamptz' })
  end: Date;
}

export default TimeSlot;
