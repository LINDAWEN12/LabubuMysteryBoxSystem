/**
 * 盲盒物品实体类
 * 定义盲盒物品表结构和与其他实体的关系
 */
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { BlindBox } from './blindbox.entity';

/**
 * 盲盒物品实体
 * 存储盲盒中包含的物品信息
 */
@Entity()
export class BoxItem {
  /**
   * 物品ID
   * 自增主键
   */
  @PrimaryGeneratedColumn()
  id!: number;

  /**
   * 物品名称
   * 盲盒中物品的名称
   */
  @Column()
  name!: string;

  /**
   * 稀有度
   * 物品的稀有程度，可选值: 'common', 'rare', 'epic', 'legendary'
   */
  @Column()
  rarity!: string; // 'common', 'rare', 'epic', 'legendary'

  /**
   * 抽中权重
   * 物品在盲盒中被抽中的概率权重
   */
  @Column()
  weight!: number; // 抽中权重

  /**
   * 物品图片
   * 物品的图片URL，默认为'/images/box-items/default.jpg'
   */
  @Column()
  image: string = '/images/box-items/default.jpg'; // 默认物品图片路径

  /**
   * 关联盲盒
   * 多对一关系，多个物品属于一个盲盒
   */
  @ManyToOne(() => BlindBox, box => box.items)
  box!: BlindBox;

  /**
   * 构造函数
   * @param init - 可选的初始化对象
   */
  constructor(init?: Partial<BoxItem>) {
    if (init) {
      Object.assign(this, init);
    }
  }
}