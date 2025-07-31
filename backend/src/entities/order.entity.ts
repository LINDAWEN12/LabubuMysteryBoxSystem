/**
 * 订单实体类
 * 定义订单表结构和与其他实体的关系
 * 使用TypeORM装饰器映射到数据库表
 */
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { BlindBox } from './blindbox.entity';
import { BoxItem } from './box-item.entity';

/**
 * 订单实体
 * 存储订单的基本信息
 * 对应数据库中的orders表
 */
@Entity()
export class Order {
  /**
   * 订单ID
   * 自增主键
   * @type {number}
   */
  @PrimaryGeneratedColumn()
  id!: number;

  /**
   * 订单价格
   * decimal类型，精度10位，小数位2位
   * 用于存储精确的货币值
   * @type {number}
   */
  @Column('decimal', { precision: 10, scale: 2 }) // precision: 总位数, scale: 小数位数
  price!: number;

  /**
   * 创建时间
   * 默认为当前时间戳
   * 记录订单创建的时间
   * @type {Date}
   */
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }) // 数据库层面设置默认值
  createdAt!: Date;

  /**
   * 关联用户
   * 多对一关系，多个订单属于一个用户
   * @type {User}
   */
  @ManyToOne(() => User, user => user.orders) // 双向关系，User实体中包含orders属性
  user!: User;

  /**
   * 关联盲盒
   * 多对一关系，多个订单可以关联同一个盲盒
   * @type {BlindBox}
   */
  @ManyToOne(() => BlindBox, box => box.orders) // 双向关系，BlindBox实体中包含orders属性
  box!: BlindBox;

  /**
   * 关联物品
   * 多对一关系，订单中的具体物品
   * @type {BoxItem}
   */
  @ManyToOne(() => BoxItem) // 单向关系，BoxItem实体中可能没有对应属性
  item!: BoxItem;

  /**
   * 构造函数
   * 用于部分初始化订单对象
   * @param init - 可选的初始化对象，包含订单属性的部分集合
   */
  constructor(init?: Partial<Order>) {
    if (init) {
      Object.assign(this, init);
    }
  }
}