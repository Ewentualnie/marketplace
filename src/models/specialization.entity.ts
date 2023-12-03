import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Advert } from './advert.entity';

@Entity()
export class Specialization {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  specializationEn: string;

  @Column({ nullable: true })
  specializationUa: string;

  @ManyToMany(() => Advert, (advert) => advert.specializations)
  @JoinTable({ name: 'adverts_specializations' })
  adverts: Advert[];
}
