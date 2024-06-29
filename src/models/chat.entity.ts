import {
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm';
import User from './user.entity';
import Message from './message.entity';

@Entity()
export class Chat {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.chatsAsUser1)
  @JoinColumn()
  user1: User;

  @ManyToOne(() => User, (user) => user.chatsAsUser2)
  @JoinColumn()
  user2: User;

  @OneToMany(() => Message, (message) => message.chat)
  messages: Message[];
}
export default Chat;
