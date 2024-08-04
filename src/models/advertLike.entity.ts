import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import Advert from './advert.entity';
import User from './user.entity';
import { Exclude } from 'class-transformer';

@Entity({ name: 'advert_likes' })
export class AdvertLike {
  @PrimaryGeneratedColumn()
  @Exclude()
  id: number;

  @ManyToOne(() => User, (user) => user.likes)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Advert, (advert) => advert.likes)
  @JoinColumn({ name: 'advert_id' })
  advert: Advert;
}

export default AdvertLike;
