import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import User from './user.entity';
import Advert from './advert.entity';

@Entity({ name: 'booking' })
export class Booking {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.bookingsAsTeacher)
  @JoinColumn()
  teacher: User;

  @ManyToOne(() => User, (user) => user.bookingsAsStudent)
  @JoinColumn()
  student: User;

  @Column({ type: 'timestamptz' })
  date: Date;

  @Column()
  studingLanguage: string;

  @OneToMany(() => Advert, (advert) => advert.bookings)
  @JoinColumn()
  advert: Advert;
}

export default Booking;
