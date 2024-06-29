import { Exclude } from 'class-transformer';
import { Role } from 'src/utils/role.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsDate, IsIn } from 'class-validator';
import FeedBack from './feedback.entity';
import Advert from './advert.entity';
import Country from './country.entity';
import AdvertLike from './advertLike.entity';
import Chat from './chat.entity';
import Schedule from './schedule.entity';

@Entity({ name: 'user' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  hashedPass: string;

  @Column()
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ default: Role.User })
  role: Role;

  @Column({ default: false })
  isDeleted: boolean;

  @UpdateDateColumn({ type: 'timestamptz' })
  lastVisit: Date;

  @CreateDateColumn({ type: 'timestamptz' })
  registeredAt: Date;

  @Column({ type: 'double precision', default: 5, scale: 2 })
  rating: number;

  @Column({ nullable: true })
  @IsDate()
  birthday: Date;

  @Column({ nullable: true })
  @IsIn(['male', 'female', 'other'])
  sex: string;

  @ManyToOne(() => Country, (country) => country.user)
  @JoinColumn({ name: 'country' })
  country: Country;

  @Column({ name: 'photo', nullable: true })
  photoPath: string;

  @Column({ nullable: true })
  @Exclude()
  refreshToken?: string;

  @OneToOne(() => Advert)
  @JoinColumn()
  advert: Advert;

  @Column({ nullable: true })
  aboutMe: string;

  @OneToMany(() => FeedBack, (feedback) => feedback.toUser, { cascade: true })
  @JoinColumn({ name: 'to_user' })
  feedbacksToMe: FeedBack[];

  @OneToMany(() => FeedBack, (feedbacks) => feedbacks.fromUser, {
    cascade: true,
  })
  @JoinColumn({ name: 'user_feedbacks' })
  feedbacksFromMe: FeedBack[];

  @OneToMany(() => AdvertLike, (like) => like.user)
  likes: AdvertLike[];

  @OneToMany(() => Chat, (chat) => chat.user1)
  @JoinColumn({ name: 'chats_as_user1' })
  @Exclude({ toPlainOnly: true })
  chatsAsUser1: Chat[];

  @OneToMany(() => Chat, (chat) => chat.user2)
  @JoinColumn({ name: 'chats_as_user2' })
  chatsAsUser2: Chat[];

  @OneToOne(() => Schedule, (schedule) => schedule.user)
  @JoinColumn()
  schedule: Schedule;
}

export default User;
