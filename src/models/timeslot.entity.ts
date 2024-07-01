import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import TimeSlots from './user-slots.entity';
import { Exclude } from 'class-transformer';

@Entity({ name: 'timeslot' })
export class TimeSlot {
  @PrimaryGeneratedColumn()
  @Exclude()
  id: number;

  @ManyToOne(() => TimeSlots, (schedule) => schedule.timeslots)
  @JoinColumn()
  @Exclude()
  schedule: TimeSlots;

  @Column({ type: 'timestamptz' })
  start: Date;

  @Column({ type: 'timestamptz' })
  end: Date;
}

export default TimeSlot;
