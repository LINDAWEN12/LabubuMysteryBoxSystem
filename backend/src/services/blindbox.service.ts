import { AppDataSource } from '../config/database';
import { BlindBox } from '../entities/blindbox.entity';
import { BoxItem } from '../entities/box-item.entity';
import { User } from '../entities/user.entity';
import { Order } from '../entities/order.entity';
import { ApiError } from '../utils/api-error';

export class BlindBoxService {
  private blindBoxRepository = AppDataSource.getRepository(BlindBox);
  private userRepository = AppDataSource.getRepository(User);
  private orderRepository = AppDataSource.getRepository(Order);

  // 添加静态初始化方法
  constructor() {
    if (!AppDataSource.isInitialized) {
      throw new Error('数据库未初始化！请先调用 AppDataSource.initialize()');
    }
  }
  async getAll(): Promise<BlindBox[]> {
    return this.blindBoxRepository.find({ 
      relations: ['items'] 
    });
  }

  async getById(id: number): Promise<BlindBox> {
    const blindBox = await this.blindBoxRepository.findOne({ 
      where: { id },
      relations: ['items'] 
    });
    
    if (!blindBox) {
      throw new ApiError(404, 'Blind box not found');
    }
    
    return blindBox;
  }

  async draw(boxId: number, userId: number): Promise<{ item: BoxItem; order: Order }> {
    const box = await this.blindBoxRepository.findOne({ 
      where: { id: boxId },
      relations: ['items'] 
    });
    
    if (!box) {
      throw new ApiError(404, 'Blind box not found');
    }

    const user = await this.userRepository.findOne({ 
      where: { id: userId } 
    });
    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    if (user.balance < box.price) {
      throw new ApiError(400, 'Insufficient balance');
    }

    // 随机抽取物品
    const totalWeight = box.items.reduce((sum, item) => sum + item.weight, 0);
    let random = Math.random() * totalWeight;
    let selectedItem: BoxItem | undefined;

    for (const item of box.items) {
      random -= item.weight;
      if (random <= 0) {
        selectedItem = item;
        break;
      }
    }

    if (!selectedItem) {
      throw new ApiError(500, 'Failed to draw item');
    }

    // 创建订单
    const order = this.orderRepository.create({
      user,
      box,
      item: selectedItem,
      price: box.price
    });

    // 更新用户余额
    user.balance -= box.price;
    await this.userRepository.save(user);
    await this.orderRepository.save(order);

    return { item: selectedItem, order };
  }
}