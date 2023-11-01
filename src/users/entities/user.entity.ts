import { Exclude } from 'class-transformer';
import { Advert } from 'src/advert/entities/advert.entity';
import { Role } from 'src/utils/role.enum';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { FeedBack } from './feedback.entity';
import { Hobby } from './hobby.entity';

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

  @Column()
  lastName: string;

  @Column({ default: Role.User })
  role: Role;

  @Column({ default: false })
  isDeleted: boolean;

  @UpdateDateColumn()
  lastVisit: Date;

  @Column()
  country: string;

  @Column({ nullable: true })
  @Exclude()
  refreshToken?: string;

  @OneToOne(() => Advert)
  @JoinColumn()
  advert: Advert;

  @ManyToMany(() => Hobby, (hobby) => hobby.user, { cascade: true })
  @JoinTable()
  hobbies: Hobby[];

  @OneToMany(() => FeedBack, (feedback) => feedback.toUser, { cascade: true })
  @JoinColumn({ name: 'toUserId' })
  feedbacks: FeedBack[];

  @ManyToMany(() => FeedBack, (feedbacks) => feedbacks.fromUsers, {
    cascade: true,
  })
  @JoinTable({ name: 'user_feedback' })
  writtenFeedbacks: FeedBack[];
}
