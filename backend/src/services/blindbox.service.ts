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

async getAll(): Promise<BlindBox[]> {
  try {
    const blindBoxes = await this.blindBoxRepository.find({ 
      relations: ['items'],
      order: { id: 'ASC' }
    });
    
    if (!blindBoxes || !Array.isArray(blindBoxes)) {
      throw new Error('查询结果不是数组');
    }
    
    // 转换数据格式，确保coverImage有完整URL
    return blindBoxes.map(box => ({
      ...box,
      coverImage: box.coverImage.startsWith('http') ? 
        box.coverImage : 
        `${process.env.API_BASE_URL || 'http://localhost:3001'}${box.coverImage}`
    }));
    
  } catch (error) {
    throw new ApiError(500, '获取盲盒数据失败');
  }
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
  // 开启事务
  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    // 获取盲盒（加锁）
    const box = await queryRunner.manager.findOne(BlindBox, {
      where: { id: boxId },
      relations: ['items'],
      lock: { mode: 'pessimistic_write' }
    });
    
    if (!box) {
      throw new ApiError(404, '盲盒不存在');
    }

    // 获取用户（加锁）
    const user = await queryRunner.manager.findOne(User, {
      where: { id: userId },
      lock: { mode: 'pessimistic_write' }
    });
    
    if (!user) {
      throw new ApiError(404, '用户不存在');
    }

    // 检查余额
    if (user.balance < box.price) {
      throw new ApiError(400, '余额不足');
    }

    // 按权重随机抽取物品
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
      throw new ApiError(500, '抽奖失败');
    }

    // 创建订单
    const order = new Order();
    order.user = user;
    order.box = box;
    order.item = selectedItem;
    order.price = box.price;
    await queryRunner.manager.save(order);

    // 更新用户余额
    user.balance -= box.price;
    await queryRunner.manager.save(user);

    // 提交事务
    await queryRunner.commitTransaction();

    return { 
      item: selectedItem, 
      order: {
        id: order.id,
        price: order.price,
        createdAt: order.createdAt,
        item: selectedItem,
        box: box,
        user: user
      }
    };
  } catch (error) {
    // 回滚事务
    await queryRunner.rollbackTransaction();
    throw error;
  } finally {
    // 释放连接
    await queryRunner.release();
  }
}
}