import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Language } from './language.entity';

@Entity({ name: 'advert' })
export class Advert {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('decimal', { scale: 2 })
  price: number;

  @Column()
  description: string;

  @Column()
  imagePath: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ default: false })
  isDeleted: boolean;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;

  @ManyToMany(() => Language, (language) => language.spokenLanguages)
  @JoinTable()
  spokenLanguages: Language[];

  @ManyToMany(() => Language, (language) => language.teachingLanguages)
  @JoinTable()
  teachingLanguages: Language[];
}
