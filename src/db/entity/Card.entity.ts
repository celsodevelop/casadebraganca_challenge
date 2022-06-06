import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Card {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column()
  email!: string;

  @Column()
  phoneNumber!: string;

  @Column()
  jobTitle!: string;

  @Column()
  company!: string;

  @Column({ nullable: true })
  photo!: string;
}
