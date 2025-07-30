import { AppDataSource } from '../config/database';
import { User } from '../entities/user.entity';
import { ApiError } from '../utils/api-error';

export class UserService {
  private userRepository = AppDataSource.getRepository(User);

  static async createInstance() {
    return new UserService();
  }

  async updateAvatar(userId: number, avatarPath: string) {
    try {
      const user = await this.userRepository.findOneBy({ id: userId });
      if (!user) {
        throw new ApiError(404, '用户不存在');
      }

      user.avatar = avatarPath;
      await this.userRepository.save(user);

      return {
        ...user,
        avatar: avatarPath // 确保返回完整的路径
      };
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(500, '更新头像失败');
    }
  }
}