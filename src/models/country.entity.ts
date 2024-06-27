import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import User from './user.entity';

@Entity({ name: 'country' })
export class Country {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  alpha2: string;

  @OneToMany(() => User, (user) => user.country)
  user: User[];
}
export default Country;
