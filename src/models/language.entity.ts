import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import Advert from './advert.entity';
import Booking from './booking.entity';

@Entity()
export class Language {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  alpha2: string;

  @Column({ nullable: false })
  languageEn: string;

  @Column({ nullable: false })
  languageUa: string;

  @ManyToMany(() => Advert, (advert) => advert.spokenLanguages)
  spokenLanguages: Advert[];

  @ManyToMany(() => Advert, (advert) => advert.teachingLanguages)
  teachingLanguages: Advert[];

  @OneToMany(() => Booking, (booking) => booking.language)
  bookings: Booking[];
}

export default Language;
