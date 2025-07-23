import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { BlindBox } from './blindbox.entity';
import { BoxItem } from './box-item.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('decimal', { precision: 10, scale: 2 })
  price!: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  @ManyToOne(() => User, user => user.orders)
  user!: User;

  @ManyToOne(() => BlindBox, box => box.orders)
  box!: BlindBox;

  @ManyToOne(() => BoxItem)
  item!: BoxItem;

  constructor(init?: Partial<Order>) {
    if (init) {
      Object.assign(this, init);
    }
  }
}