import { Exclude } from 'class-transformer';
import { Advert } from 'src/advert/entities/advert.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

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

  @Column({ nullable: true })
  refreshToken?: string;

  @OneToOne(() => Advert)
  @JoinColumn()
  advert: Advert;
}
