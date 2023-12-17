import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Advert } from './advert.entity';
import { User } from './user.entity';

@Entity({ name: 'advert_likes' })
export class AdvertLike {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.likes)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Advert, (advert) => advert.likes)
  @JoinColumn({ name: 'advert_id' })
  advert: Advert;
}
