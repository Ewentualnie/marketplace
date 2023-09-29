import { Exclude } from 'class-transformer';
import { Advert } from 'src/advert/entities/advert.entity';
import { Role } from 'src/utils/role.enum';
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
}
