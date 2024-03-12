// import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
// import { User } from './user.entity';

// @Entity({ name: 'schedule' })
// export class Schedule {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @ManyToOne(() => User, (user) => user.schedules)
//   user: User;

//   @Column()
//   public week!: number;

//   @Column()
//   public dayOfWeek!: string;

//   @Column('simple-array')
//   public timeSlots!: string[];
// }

// export default Schedule;
