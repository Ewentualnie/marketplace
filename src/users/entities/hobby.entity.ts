import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { User } from 'src/users/entities/user.entity';

@Entity({ name: 'hobby' })
export class Hobby {
  @PrimaryGeneratedColumn()
  @Exclude()
  id: number;

  @Column({ unique: true })
  hobby: string;

  @ManyToMany(() => User, (user) => user.hobbies)
  @JoinTable({ name: 'users_hobby' })
  user: User[];
}
