/**
 * 玩家秀实体类
 * 定义玩家秀表结构和与其他实体的关系
 */
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { BoxItem } from './box-item.entity';

/**
 * 玩家秀实体
 * 存储玩家分享的盲盒物品展示信息
 */
@Entity()
export class Showcase {
  /**
   * 玩家秀ID
   * 自增主键
   */
  @PrimaryGeneratedColumn()
  id!: number;

  /**
   * 展示图片
   * 玩家分享的物品图片URL
   */
  @Column()
  image!: string;

  /**
   * 展示描述
   * 玩家对展示物品的评论或描述
   */
  @Column('text')
  comment!: string;

  /**
   * 创建时间
   * 默认为当前时间戳
   */
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  /**
   * 关联用户
   * 多对一关系，多个玩家秀属于一个用户
   */
  @ManyToOne(() => User, user => user.showcases)
  user!: User;

  /**
   * 关联物品
   * 多对一关系，玩家秀中展示的物品（可选）
   */
  @ManyToOne(() => BoxItem, { nullable: true })
  item?: BoxItem;

  /**
   * 构造函数
   * @param init - 可选的初始化对象
   */
  constructor(init?: Partial<Showcase>) {
    if (init) {
      Object.assign(this, init);
    }
  }
}