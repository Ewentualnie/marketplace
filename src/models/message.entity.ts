import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import Chat from './chat.entity';

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  @Exclude()
  id: number;

  @Column({ nullable: false })
  text: string;

  @Column({ default: false })
  isReaded: boolean;

  @CreateDateColumn()
  writtedAt: Date;

  @Column()
  senderId: number;

  @Column()
  receiverId: number;

  @ManyToOne(() => Chat, (chat) => chat.messages)
  @JoinColumn()
  @Exclude()
  chat: Chat;
}

export default Message;
