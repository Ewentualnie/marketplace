import { Exclude } from 'class-transformer';
import { Role } from 'src/utils/role.enum';
import {
  Column,
  CreateDateColumn,
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
import { IsDate, IsIn } from 'class-validator';
import { Advert } from './advert.entity';

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

  @UpdateDateColumn()
  lastVisit: Date;

  @CreateDateColumn()
  registeredAt: Date;

  @Column({ nullable: true })
  @IsDate()
  birthday: Date;

  @Column({ nullable: true })
  @IsIn(['male', 'female'])
  sex: string;

  @Column({ nullable: true })
  country: string;

  @Column({ nullable: true })
  @Exclude()
  refreshToken?: string;

  @OneToOne(() => Advert)
  @JoinColumn()
  advert: Advert;

  @ManyToMany(() => Hobby, (hobby) => hobby.user, { cascade: true })
  @JoinTable({ name: 'user_hobbies' })
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
