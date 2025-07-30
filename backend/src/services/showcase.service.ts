import { AppDataSource } from '../config/database';
import { Showcase } from '../entities/showcase.entity';
import { getRepository } from 'typeorm';
import { ApiError } from '../utils/api-error'
export class ShowcaseService {
  private showcaseRepository = AppDataSource.getRepository(Showcase);

  // 添加静态初始化方法
  static async createInstance() {
    //await AppDataSource.initialize();
    return new ShowcaseService();
  }

  async getAll() {
    return this.showcaseRepository.find({
      relations: ['user', 'item'],
      order: { createdAt: 'DESC' }
    });
  }

    async create(data: {
    image: string;
    comment: string;
    itemId?: number;
    user: { id: number };
  }) {
    try {
      const showcase = this.showcaseRepository.create(data);
      return await this.showcaseRepository.save(showcase);
    } catch (error) {
      throw new ApiError(500, '创建玩家秀失败');
    }
  }

  async delete(id: number, userId: number): Promise<boolean> {
  // 先查询展示柜以检查所有权
  const showcase = await this.showcaseRepository.findOne({
    where: { id },
    relations: ['user']
  });

  if (!showcase) {
    return false;
  }

  // 允许删除没有userId的旧记录或用户自己的记录
  if (showcase.user.id === userId) {
    await this.showcaseRepository.remove(showcase);
    return true;
  }

  return false;
}
}