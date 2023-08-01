import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Advert } from './advert.entity';

@Entity()
export class Hobby {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  hobby: string;

  @ManyToOne(() => Advert, (advert) => advert.hobbys)
  advert: Advert;
}
