import {
  Check,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'feedback' })
export class FeedBack {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'integer' })
  @Check('mark >= 1 AND mark <= 5')
  mark: number;

  @Column()
  message: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.feedbacks)
  @JoinTable()
  toUser: User;

  @ManyToMany(() => User, (user) => user.writtenFeedbacks)
  @JoinTable()
  fromUsers: User[];
}
