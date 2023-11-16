import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Advert } from './advert.entity';

@Entity()
export class Language {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  languageEn: string;

  @Column({ nullable: true })
  languageUa: string;

  @ManyToMany(() => Advert, (advert) => advert.spokenLanguages)
  spokenLanguages: Advert[];

  @ManyToMany(() => Advert, (advert) => advert.teachingLanguages)
  teachingLanguages: Advert[];
}
