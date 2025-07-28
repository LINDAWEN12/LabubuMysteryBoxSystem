import { AppDataSource } from '../config/database';
import { Showcase } from '../entities/showcase.entity';

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

  async create(createDto: {
    userId: number;
    itemId: number;
    image: string;
    comment: string;
  }) {
    const showcase = this.showcaseRepository.create(createDto);
    return this.showcaseRepository.save(showcase);
  }

  async delete(id: number, userId: number): Promise<boolean> {
    const result = await this.showcaseRepository.delete({
      id,
      user: { id: userId }
    });
    return !!result?.affected;
  }
}