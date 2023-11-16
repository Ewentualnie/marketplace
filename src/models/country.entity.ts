import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'country' })
export class Country {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  countryEn: string;

  @Column({ nullable: true })
  countryUa: string;

  @OneToMany(() => User, (user) => user.country)
  user: User[];
}
