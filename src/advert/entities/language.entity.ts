import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Advert } from './advert.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class Language {
  @PrimaryGeneratedColumn()
  @Exclude()
  id: number;

  @Column()
  language: string;

  @ManyToMany(() => Advert, (advert) => advert.spokenLanguages)
  spokenLanguages: Advert[];

  @ManyToMany(() => Advert, (advert) => advert.teachingLanguages)
  teachingLanguages: Advert[];
}
