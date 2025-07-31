/**
 * 盲盒实体类
 * 定义盲盒表结构和与其他实体的关系
 * 使用TypeORM装饰器映射到数据库表
 */
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { BoxItem } from './box-item.entity';
import { Order } from './order.entity';

/**
 * 盲盒实体
 * 存储盲盒的基本信息
 * 对应数据库中的blindboxes表
 */
@Entity()
export class BlindBox {
  /**
   * 盲盒ID
   * 自增主键
   * @type {number}
   */
  @PrimaryGeneratedColumn()
  id!: number;

  /**
   * 盲盒名称
   * 盲盒的标题或系列名称
   * @type {string}
   */
  @Column()
  name!: string;

  /**
   * 盲盒描述
   * 盲盒的详细介绍
   * 使用text类型支持较长文本
   * @type {string}
   */
  @Column('text') // text类型适合存储较长的描述文本
  description!: string;

  /**
   * 盲盒价格
   * decimal类型，精度10位，小数位2位
   * 用于存储精确的货币值
   * @type {number}
   */
  @Column('decimal', { precision: 10, scale: 2 }) // precision: 总位数, scale: 小数位数
  price!: number;

  /**
   * 封面图片
   * 盲盒的封面图片URL
   * 默认为'/images/blindboxes/default.jpg'
   * @type {string}
   */
  @Column()
  coverImage: string = '/images/blindboxes/default.jpg'; // 默认图片路径

  /**
   * 包含物品列表
   * 一对多关系，一个盲盒可以包含多个物品
   * @type {BoxItem[]}
   */
  @OneToMany(() => BoxItem, item => item.box) // 双向关系，BoxItem实体中包含box属性
  items!: BoxItem[];

  /**
   * 订单列表
   * 一对多关系，一个盲盒可以有多个订单
   * @type {Order[]}
   */
  @OneToMany(() => Order, order => order.box) // 双向关系，Order实体中包含box属性
  orders!: Order[];

  /**
   * 构造函数
   * 用于部分初始化盲盒对象
   * @param init - 可选的初始化对象，包含盲盒属性的部分集合
   */
  constructor(init?: Partial<BlindBox>) {
    if (init) {
      Object.assign(this, init);
    }
  }
}