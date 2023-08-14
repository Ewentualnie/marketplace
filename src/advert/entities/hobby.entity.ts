import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Advert } from './advert.entity';

@Entity()
export class Hobby {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  hobby: string;

  @ManyToMany(() => Advert, (advert) => advert.hobbies)
  advert: Advert;

  equals(other: Hobby): boolean {
    console.log(this.hobby);
    console.log(other.hobby);

    return this.hobby === other.hobby;
  }
}
