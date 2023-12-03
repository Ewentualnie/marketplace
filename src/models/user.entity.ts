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
import { FeedBack } from './feedback.entity';
import { IsDate, IsIn } from 'class-validator';
import { Advert } from './advert.entity';
import { Country } from './country.entity';
import { Mail } from './mail.entity';

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

  @OneToMany(() => Advert, (advert) => advert.user, {
    cascade: true,
  })
  @JoinColumn({ name: 'user_favorite_adverts' })
  favoriteAdverts: Advert[];

  @OneToMany(() => Mail, (mail) => mail.toUser, { cascade: true })
  @JoinColumn({ name: 'received_mails' })
  receivedMails: Mail[];

  @OneToMany(() => Mail, (mail) => mail.fromUser, { cascade: true })
  @JoinColumn({ name: 'sended_mails' })
  sentMails: Mail[];
}
