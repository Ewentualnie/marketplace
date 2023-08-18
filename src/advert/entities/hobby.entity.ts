import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Advert } from './advert.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class Hobby {
  @PrimaryGeneratedColumn()
  @Exclude()
  id: number;

  @Column({ unique: true })
  hobby: string;

  @ManyToMany(() => Advert, (advert) => advert.hobbies)
  advert: Advert;
}
