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

  /**
   * 用户充值
   * @param userId 用户ID
   * @param amount 充值金额
   * @returns 更新后的用户信息
   */
  async recharge(userId: number, amount: number): Promise<User> {
    const queryRunner = AppDataSource.createQueryRunner();
    
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      // 获取用户并加锁
      const user = await queryRunner.manager.findOne(User, {
        where: { id: userId },
        lock: { mode: 'pessimistic_write' }
      });

      if (!user) {
        throw new ApiError(404, '用户不存在');
      }

      // 更新余额
      user.balance += amount;
      await queryRunner.manager.save(user);
      await queryRunner.commitTransaction();

      return user;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}