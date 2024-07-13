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
import Language from './language.entity';

@Entity({ name: 'booking' })
export class Booking {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.bookingsAsTeacher)
  @JoinColumn({ name: 'teacher' })
  teacher: User;

  @ManyToOne(() => User, (user) => user.bookingsAsStudent, { nullable: true })
  @JoinColumn({ name: 'student' })
  student: User;

  @Column({ type: 'timestamptz' })
  date: Date;

  @ManyToOne(() => Language, (lang) => lang.bookings, { nullable: true })
  @JoinColumn({ name: 'languageId' })
  language: Language;

  @OneToMany(() => Advert, (advert) => advert.bookings)
  @JoinColumn()
  advert: Advert;

  @Column()
  isActive: boolean;

  @Column({ default: false })
  isBooked: boolean;
}

export default Booking;
