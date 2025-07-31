/**
 * 用户服务
 * 处理用户相关的业务逻辑，包括头像更新和账户充值等功能
 */
import { AppDataSource } from '../config/database';
import { User } from '../entities/user.entity';
import { ApiError } from '../utils/api-error';

/**
 * 用户服务类
 */
export class UserService {
  // 用户仓储，用于数据库操作
  private userRepository = AppDataSource.getRepository(User);

  /**
   * 创建UserService实例
   * @returns {Promise<UserService>} UserService实例
   */
  static async createInstance() {
    return new UserService();
  }

  /**
   * 更新用户头像
   * @param {number} userId - 用户ID
   * @param {string} avatarPath - 头像文件路径
   * @returns {Promise<{id: number, username: string, avatar: string}>} - 更新后的用户信息
   * @throws {ApiError} - 当用户不存在或更新失败时抛出错误
   */
  async updateAvatar(userId: number, avatarPath: string) {
    try {
      // 查找用户
      const user = await this.userRepository.findOneBy({ id: userId });
      if (!user) {
        throw new ApiError(404, '用户不存在');
      }

      // 更新用户头像
      user.avatar = avatarPath;
      await this.userRepository.save(user);

      // 返回更新后的用户信息
      return {
        ...user,
        avatar: avatarPath // 确保返回完整的头像路径
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
   * @param {number} userId - 用户ID
   * @param {number} amount - 充值金额
   * @returns {Promise<User>} - 更新后的用户实体
   * @throws {ApiError} - 当用户不存在或充值失败时抛出错误
   */
  async recharge(userId: number, amount: number): Promise<User> {
    // 创建查询运行器以支持事务
    const queryRunner = AppDataSource.createQueryRunner();
    
    try {
      // 连接数据库
      await queryRunner.connect();
      // 开始事务
      await queryRunner.startTransaction();

      // 获取用户并加锁（悲观锁）
      const user = await queryRunner.manager.findOne(User, {
        where: { id: userId },
        lock: { mode: 'pessimistic_write' } // 防止并发充值导致的余额不一致
      });

      if (!user) {
        throw new ApiError(404, '用户不存在');
      }

      // 更新余额
      user.balance += amount;
      await queryRunner.manager.save(user);
      // 提交事务
      await queryRunner.commitTransaction();

      return user;
    } catch (error) {
      // 回滚事务
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      // 释放查询运行器
      await queryRunner.release();
    }
  }
}