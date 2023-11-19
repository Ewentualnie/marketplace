import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Specialization {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  specializationEn: string;

  @Column({ nullable: true })
  specializationUa: string;

  @ManyToMany(() => User, (user) => user.specializations)
  @JoinTable({ name: 'users_specializations' })
  users: User[];
}
