import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Hobby } from './hobby.entity';

@Entity({ name: 'advert' })
export class Advert {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('decimal')
  price: number;

  @Column()
  shortDescription: string;

  @Column()
  imagePath: string;

  @OneToMany(() => Hobby, (hobby) => hobby.advert)
  @JoinColumn()
  hobbys: Hobby[];

  @OneToOne(() => User)
  @JoinColumn()
  user: User;
}

// @Column()
// fullDescription: string;

// @OneToMany()
// avalLength: [ 30, 60, 120 ];
// @OneToMany()
// avalShedule: [ "monday" : [[13, 15.5], [18, 18.5]], "thursday" : [[8, 12]] ];
// @OneToMany()
// tagsSpecialization: [ "improvement", "basics" ];
// @OneToMany()
// tagsHobby: [ "fishing", "gardening", "board games" ];
// @OneToMany()
// tagsSpokenLang: [ "ukrainian", "english", "german" ];
// @OneToMany()
// tagsTeachingLang: [ "english", "german" ];
// @OneToMany()
// tagsNativeLang: [ "ukrainian" ];
