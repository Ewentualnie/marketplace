import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'advert' })
export class Advert {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  price: number;

  @Column()
  shortDescription: string;

  @Column()
  fullDescription: string;
}
// @OneToMany()
// avalLength: [ 30, 60, 120 ];
// @OneToMany()
// avalShedule: [ "monday" : [[13, 15.5], [18, 18.5]], "thursday" : [[8, 12]] ];
// @OneToMany()
// tagsSpecialization: [ "improvement", "basics" ];
// @OneToMany()
// tagsHobby: [ "fishing", "gardening", "board games" ];
// @OneToMany()
// tagsSpokenLang: [ "ukrainian", "english", "german" ];
// @OneToMany()
// tagsTeachingLang: [ "english", "german" ];
// @OneToMany()
// tagsNativeLang: [ "ukrainian" ];