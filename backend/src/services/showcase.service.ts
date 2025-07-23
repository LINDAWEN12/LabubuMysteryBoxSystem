import { getRepository } from 'typeorm';
import { Showcase } from '../entities/showcase.entity';

export class ShowcaseService {
  private showcaseRepository = getRepository(Showcase);

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
  
  // 更健壮的检查方式
  return !!result?.affected;
}
}