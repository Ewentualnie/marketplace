import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Hobby } from './hobby.entity';
import { Language } from './language.entity';

@Entity({ name: 'advert' })
export class Advert {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('decimal', { scale: 2 })
  price: number;

  @Column()
  shortDescription: string;

  @Column()
  imagePath: string;

  @ManyToMany(() => Hobby, (hobby) => hobby.advert, { cascade: true })
  @JoinTable()
  hobbies: Hobby[];

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

// @Column()
// fullDescription: string; а воно треба взагалі?

// @OneToMany()
// avalLength: [ 30, 60, 120 ];
// @OneToMany()
// avalShedule: [ "monday" : [[13, 15.5], [18, 18.5]], "thursday" : [[8, 12]] ];
// @OneToMany()
// tagsSpecialization: [ "improvement", "basics" ];

// @OneToMany()
// tagsNativeLang: [ "ukrainian" ];
