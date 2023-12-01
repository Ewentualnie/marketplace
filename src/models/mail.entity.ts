import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Mail {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  message: string;

  @ManyToOne(() => User, (user) => user.receivedMails)
  toUser: User;

  @ManyToOne(() => User, (user) => user.sentMails)
  fromUser: User;

  @CreateDateColumn()
  writtedAt: Date;

  @Column({ default: false })
  isReaded: boolean;
}
