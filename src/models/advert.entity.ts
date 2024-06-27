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
} from 'typeorm';
import Language from './language.entity';
import User from 'src/models/user.entity';
import Specialization from './specialization.entity';
import AdvertLike from './advertLike.entity';

@Entity({ name: 'advert' })
export class Advert {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('decimal', { scale: 2 })
  price: number;

  @Column()
  description: string;

  @Column({ nullable: true })
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

  @OneToMany(() => AdvertLike, (like) => like.advert)
  likes: AdvertLike[];

  @ManyToMany(() => Specialization, (val) => val.adverts, {
    cascade: true,
  })
  @JoinTable({ name: 'advert_specializations' })
  specializations: Specialization[];
}

export default Advert;
