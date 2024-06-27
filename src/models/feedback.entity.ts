import {
  Check,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import User from './user.entity';

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

  @ManyToOne(() => User, (user) => user.feedbacksToMe)
  @JoinColumn({ name: 'to_user' })
  toUser: User;

  @ManyToOne(() => User, (user) => user.feedbacksFromMe)
  @JoinColumn({ name: 'from_user' })
  fromUser: User;
}
export default FeedBack;
