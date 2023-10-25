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
} from 'typeorm';
import { FeedBack } from './feedback.entity';

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
  name: string;

  @Column({ default: Role.User })
  role: Role;

  @Column({ default: false })
  isDeleted: boolean;

  @Column({ nullable: true })
  @Exclude()
  refreshToken?: string;

  @OneToOne(() => Advert)
  @JoinColumn()
  advert: Advert;

  @OneToMany(() => FeedBack, (feedbacks) => feedbacks.toUser, { cascade: true })
  @JoinTable()
  feedbacks: FeedBack[];

  @ManyToMany(() => FeedBack, (feedbacks) => feedbacks.fromUsers, {
    cascade: true,
  })
  @JoinTable()
  writtenFeedbacks: FeedBack[];
}
