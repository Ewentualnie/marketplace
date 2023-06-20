import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  login: string;

  @Column()
  email: string;

  @Column()
  name: string;

  @Column()
  surname: string;

  @Column()
  residence?: string;

  @Column()
  expirience?: string;

  @Column()
  preview?: string;

  languages?: string;
  workingDays?: Date;
  workingHours?: string;
}
