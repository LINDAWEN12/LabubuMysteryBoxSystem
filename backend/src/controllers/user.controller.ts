/**
 * 用户控制器
 * 处理用户相关的HTTP请求，包括头像上传和账户充值等功能
 */
import { Router } from 'express';
import { UserService } from '../services/user.service';
import { AuthenticatedRequest } from '../types/custom-request';
import { ApiError } from '../utils/api-error';
import { authMiddleware } from '../middlewares/auth.middleware';
import { avatarUpload } from '../utils/avatarUpload';
import { ApiResponse } from '../utils/api-response';
import { logger } from '../utils/logger'
import { AppDataSource } from '../config/database';
import { User } from '../entities/user.entity';

const router = Router();
let userService: UserService;

/**
 * 初始化中间件
 * 确保在处理请求前UserService实例已创建
 */
router.use(async (req, res, next) => {
  if (!userService) {
    userService = await UserService.createInstance();
  }
  next();
});

/**
 * @swagger
 * /api/auth/avatar: 
 *   post: 
 *     summary: 上传用户头像
 *     tags: [用户]
 *     security: 
 *       - bearerAuth: []
 *     requestBody: 
 *       required: true
 *       content: 
 *         multipart/form-data: 
 *           schema: 
 *             type: object
 *             properties: 
 *               avatar: 
 *                 type: string
 *                 format: binary
 *                 description: 头像图片文件
 *     responses: 
 *       200: 
 *         description: 头像上传成功
 *         content: 
 *           application/json: 
 *             schema: 
 *               type: object
 *               properties: 
 *                 success: 
 *                   type: boolean
 *                   example: true
 *                 data: 
 *                   $ref: '#/components/schemas/User'
 *       400: 
 *         description: 参数错误或文件无效
 *       401: 
 *         description: 未授权
 *       500: 
 *         description: 服务器错误
 */
/**
 * 上传用户头像
 * @param {AuthenticatedRequest} req - 包含用户认证信息的请求对象
 * @param {Response} res - 响应对象
 * @param {NextFunction} next - 下一步中间件函数
 * @returns {Promise<void>} - 返回Promise
 */
router.post(
  '/avatar',
  authMiddleware,
  avatarUpload.single('avatar'),
  async (req: AuthenticatedRequest, res, next) => {
    try {
      // 验证是否有文件上传
      if (!req.file) {
        throw new ApiError(400, '请选择要上传的头像文件');
      }

      // 验证用户是否已认证
      if (!req.user) {
        throw new ApiError(401, '未授权访问');
      }

      // 构建头像路径
      const avatarPath = `/uploads/avatars/${req.file.filename}`;
      // 更新用户头像
      const updatedUser = await userService.updateAvatar(req.user.id, avatarPath);

      // 返回成功响应
      res.json({
        success: true,
        data: {
          ...updatedUser,
          avatar: avatarPath // 返回完整的头像路径
        }
      });
    } catch (error) {
      // 传递错误到错误处理中间件
      next(error);
    }
  }
);

/**
 * @swagger
 * /api/user/recharge: 
 *   post: 
 *     summary: 用户充值
 *     tags: [用户]
 *     security: 
 *       - bearerAuth: []
 *     requestBody: 
 *       required: true
 *       content: 
 *         application/json: 
 *           schema: 
 *             type: object
 *             properties: 
 *               amount: 
 *                 type: number
 *                 default: 100
 *     responses: 
 *       200: 
 *         description: 充值成功
 *         content: 
 *           application/json: 
 *             schema: 
 *               $ref: '#/components/schemas/User'
 */
/**
 * 用户充值
 * @param {AuthenticatedRequest} req - 包含用户认证信息的请求对象
 * @param {Response} res - 响应对象
 * @returns {Promise<void>} - 返回Promise
 */
router.post('/recharge', authMiddleware, async (req: AuthenticatedRequest, res) => {
  // 创建查询运行器以支持事务
  const queryRunner = AppDataSource.createQueryRunner();
  
  try {
    // 连接数据库
    await queryRunner.connect();
    // 开始事务
    await queryRunner.startTransaction();

    // 验证用户是否已认证
    if (!req.user) {
      throw new Error('未授权');
    }

    // 获取充值金额
    const amount = Number(req.body.amount) || 100;
    if (amount <= 0) {
      throw new Error('充值金额必须大于0');
    }

    // 获取用户并加锁（悲观锁）
    const user = await queryRunner.manager.findOne(User, {
      where: { id: req.user.id },
      lock: { mode: 'pessimistic_write' } // 防止并发充值导致的余额不一致
    });

    if (!user) {
      throw new Error('用户不存在');
    }

    // 更新余额
    user.balance += amount;
    await queryRunner.manager.save(user);
    // 提交事务
    await queryRunner.commitTransaction();

    // 返回成功响应
    res.json(ApiResponse.success({
      id: user.id,
      username: user.username,
      balance: user.balance,
      avatar: user.avatar
    }));

    // 记录日志
    logger.info(`用户 ${user.id} 充值成功，金额: ${amount}`);
  } catch (error) {
    // 回滚事务
    await queryRunner.rollbackTransaction();
    // 记录错误日志
    logger.error('充值失败:', error);
    // 返回错误响应
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : '充值失败'
    });
  } finally {
    // 释放查询运行器
    await queryRunner.release();
  }
});

export const userRouter = router;