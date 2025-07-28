import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { BlindBox } from './blindbox.entity';

@Entity()
export class BoxItem {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  rarity!: string; // 'common', 'rare', 'epic', 'legendary'

  @Column()
  weight!: number; // 抽中权重

  @Column()
  image: string = '/images/box-items/default.png'; // 默认物品图片路径

  @ManyToOne(() => BlindBox, box => box.items)
  box!: BlindBox;

  constructor(init?: Partial<BoxItem>) {
    if (init) {
      Object.assign(this, init);
    }
  }
}