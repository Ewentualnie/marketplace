import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import Schedule from './schedule.entity';
import { Exclude } from 'class-transformer';

@Entity({ name: 'timeslot' })
export class TimeSlot {
  @PrimaryGeneratedColumn()
  @Exclude()
  id: number;

  @ManyToOne(() => Schedule, (schedule) => schedule.timeslots)
  @JoinColumn()
  @Exclude()
  schedule: Schedule;

  @Column({ type: 'timestamptz' })
  start: Date;

  @Column({ type: 'timestamptz' })
  end: Date;
}

export default TimeSlot;
