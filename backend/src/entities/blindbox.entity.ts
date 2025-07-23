import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { BoxItem } from './box-item.entity';
import { Order } from './order.entity';

@Entity()
export class BlindBox {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column('text')
  description!: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price!: number;

  @Column()
  coverImage!: string;

  @OneToMany(() => BoxItem, item => item.box)
  items!: BoxItem[];

  @OneToMany(() => Order, order => order.box)
  orders!: Order[];

  constructor(init?: Partial<BlindBox>) {
    if (init) {
      Object.assign(this, init);
    }
  }
}