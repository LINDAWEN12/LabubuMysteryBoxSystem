import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { BoxItem } from './box-item.entity';

@Entity()
export class Showcase {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  image!: string;

  @Column('text')
  comment!: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  @ManyToOne(() => User, user => user.showcases)
  user!: User;

  @ManyToOne(() => BoxItem, { nullable: true })
  item?: BoxItem;

  constructor(init?: Partial<Showcase>) {
    if (init) {
      Object.assign(this, init);
    }
  }
}