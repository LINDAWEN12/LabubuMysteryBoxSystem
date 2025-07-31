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

// 初始化中间件
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
router.post(
  '/avatar',
  authMiddleware,
  avatarUpload.single('avatar'),
  async (req: AuthenticatedRequest, res, next) => {
    try {
      if (!req.file) {
        throw new ApiError(400, '请选择要上传的头像文件');
      }

      if (!req.user) {
        throw new ApiError(401, '未授权访问');
      }

      const avatarPath = `/uploads/avatars/${req.file.filename}`;
      const updatedUser = await userService.updateAvatar(req.user.id, avatarPath);

      res.json({
        success: true,
        data: {
          ...updatedUser,
          avatar: avatarPath // 返回完整的路径
        }
      });
    } catch (error) {
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
router.post('/recharge', async (req: AuthenticatedRequest, res) => {
  const queryRunner = AppDataSource.createQueryRunner();
  
  try {
    await queryRunner.connect();
    await queryRunner.startTransaction();

    if (!req.user) {
      throw new Error('未授权');
    }

    const amount = Number(req.body.amount) || 100;
    if (amount <= 0) {
      throw new Error('充值金额必须大于0');
    }

    // 获取用户并加锁
    const user = await queryRunner.manager.findOne(User, {
      where: { id: req.user.id },
      lock: { mode: 'pessimistic_write' }
    });

    if (!user) {
      throw new Error('用户不存在');
    }

    // 更新余额
    user.balance += amount;
    await queryRunner.manager.save(user);
    await queryRunner.commitTransaction();

    res.json(ApiResponse.success({
      id: user.id,
      username: user.username,
      balance: user.balance,
      avatar: user.avatar
    }));

    logger.info(`用户 ${user.id} 充值成功，金额: ${amount}`);
  } catch (error) {
    await queryRunner.rollbackTransaction();
    logger.error('充值失败:', error);
  } finally {
    await queryRunner.release();
  }
});
export const userRouter = router;