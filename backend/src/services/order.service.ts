import { AppDataSource } from '../config/database';
import { Order } from '../entities/order.entity';

export class OrderService {
  private orderRepository = AppDataSource.getRepository(Order);

  // 添加静态初始化方法
  static async createInstance() {
   // await AppDataSource.initialize();
    return new OrderService();
  }

  async getUserOrders(userId: number) {
    return this.orderRepository.find({
      where: { user: { id: userId } },
      relations: ['box', 'item'],
      order: { createdAt: 'DESC' }
    });
  }

  async getOrderById(orderId: number, userId: number) {
    return this.orderRepository.findOne({
      where: { id: orderId, user: { id: userId } },
      relations: ['box', 'item', 'user']
    });
  }
}