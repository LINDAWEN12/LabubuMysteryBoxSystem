/**
 * 用户实体类
 * 定义用户表结构和与其他实体的关系
 * 使用TypeORM装饰器映射到数据库表
 */
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Order } from './order.entity';
import { Showcase } from './showcase.entity';

/**
 * 用户实体
 * 存储用户的基本信息
 * 对应数据库中的users表
 */
@Entity()
export class User {
  /**
   * 用户ID
   * 自增主键
   * @type {number}
   */
  @PrimaryGeneratedColumn()
  id!: number;

  /**
   * 用户名
   * 唯一约束，用于用户登录
   * @type {string}
   */
  @Column({ unique: true }) // 唯一约束确保用户名不重复
  username!: string;

  /**
   * 密码
   * 存储加密后的用户密码
   * 注意：永远不要存储明文密码
   * @type {string}
   */
  @Column()
  password!: string;

  /**
   * 余额
   * 用户账户余额，默认1000
   * 用于购买盲盒
   * @type {number}
   */
  @Column({ default: 1000 }) // 默认初始余额为1000
  balance: number = 1000;

  /**
   * 头像
   * 用户头像URL，默认为空字符串
   * @type {string}
   */
  @Column({ default: '' }) // 默认没有头像
  avatar: string = '';

  /**
   * 订单列表
   * 一对多关系，一个用户可以有多个订单
   * @type {Order[]}
   */
  @OneToMany(() => Order, order => order.user) // 双向关系，Order实体中包含user属性
  orders!: Order[];

  /**
   * 玩家秀列表
   * 一对多关系，一个用户可以有多个玩家秀
   * @type {Showcase[]}
   */
  @OneToMany(() => Showcase, showcase => showcase.user) // 双向关系，Showcase实体中包含user属性
  showcases!: Showcase[];

  /**
   * 构造函数
   * 用于部分初始化用户对象
   * @param init - 可选的初始化对象，包含用户属性的部分集合
   */
  constructor(init?: Partial<User>) {
    if (init) {
      Object.assign(this, init);
    }
  }
}