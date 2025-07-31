import { Router } from 'express';
import { BlindBoxService } from '../services/blindbox.service';
import { AuthenticatedRequest } from '../types/custom-request';
import { ApiError } from '../utils/api-error';
import { logger } from '../utils/logger';

const router = Router();
const blindBoxService = new BlindBoxService();

/**
 * @swagger
 * /api/draw/{id}:
 *   post:
 *     summary: 抽取盲盒
 *     tags: [抽奖]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 盲盒ID
 *     responses:
 *       200:
 *         description: 抽奖结果
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     item:
 *                       $ref: '#/components/schemas/BoxItem'
 *                     order:
 *                       $ref: '#/components/schemas/Order'
 *       400:
 *         description: 余额不足
 *       404:
 *         description: 盲盒不存在
 */
router.post('/:id', async (req: AuthenticatedRequest, res, next) => {
  try {
    if (!req.user) {
      logger.error('抽奖请求未认证', { headers: req.headers });
      throw new ApiError(401, '用户未认证');
    }

    const boxId = parseInt(req.params.id);
    if (isNaN(boxId)) {
      throw new ApiError(400, '无效的盲盒ID');
    }

    logger.info(`用户 ${req.user.id} 正在抽取盲盒 ${boxId}`);
    
    // 调用抽奖服务
    const result = await blindBoxService.draw(boxId, req.user.id);
    
    res.json({
      success: true,
      data: result,
      message: '抽奖成功'
    });
    
  } catch (error) {
    logger.error('抽奖失败', {
      userId: req.user?.id,
      boxId: req.params.id,
    });
    next(error);
  }
});

export { router as drawRouter };