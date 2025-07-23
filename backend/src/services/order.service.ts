import { getRepository } from 'typeorm';
import { Order } from '../entities/order.entity';

export class OrderService {
  private orderRepository = getRepository(Order);

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