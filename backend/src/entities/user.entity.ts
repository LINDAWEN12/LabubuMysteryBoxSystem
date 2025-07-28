import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Order } from './order.entity';
import { Showcase } from './showcase.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  username!: string;

  @Column()
  password!: string;

  @Column({ default: 1000 })
  balance: number = 1000;

  @Column({ default: '' })
  avatar: string = '';

  @OneToMany(() => Order, order => order.user)
  orders!: Order[];

  @OneToMany(() => Showcase, showcase => showcase.user)
  showcases!: Showcase[];

  constructor(init?: Partial<User>) {
    if (init) {
      Object.assign(this, init);
    }
  }
}