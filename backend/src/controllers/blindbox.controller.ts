import { Router } from 'express';
import { BlindBoxService } from '../services/blindbox.service';
import { AuthenticatedRequest } from '../types/custom-request';
import { ApiError } from '../utils/api-error';
import { AppDataSource } from '../config/database';
import { logger } from '../utils/logger';

const router = Router();
let blindBoxService: BlindBoxService;

// 添加初始化中间件
router.use(async (req, res, next) => {
  if (!blindBoxService) {
    blindBoxService = new BlindBoxService();
  }
  next();
});

/**
 * @swagger
 * /api/blindboxes:
 *   get:
 *     summary: 获取所有盲盒列表
 *     tags: [盲盒]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 盲盒列表
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/BlindBox'
 */
router.get('/', async (req: AuthenticatedRequest, res, next) => {
  try {
    // 调试日志：打印请求头中的Authorization
    logger.debug(`请求头Authorization: ${req.headers.authorization}`);
    
    // 验证用户信息
    if (!req.user) {
      logger.error('未获取到用户信息，请检查authMiddleware是否执行');
      throw new ApiError(401, '用户未认证');
    }
    
    logger.debug(`当前用户ID: ${req.user.id}, 用户名: ${req.user.username}`);
    
    const blindBoxes = await blindBoxService.getAll();
    res.json({ 
      success: true,
      data: blindBoxes,
      currentUser: { // 返回当前用户信息用于调试
        id: req.user.id,
        username: req.user.username
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/blindboxes/{id}:
 *   get:
 *     summary: 获取盲盒详情
 *     tags: [盲盒]
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
 *         description: 盲盒详情
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/BlindBox'
 *       404:
 *         description: 盲盒未找到
 */
router.get('/:id', async (req: AuthenticatedRequest, res, next) => {
  try {
    logger.debug(`获取盲盒详情请求，用户ID: ${req.user?.id}`);
    
    const id = parseInt(req.params.id);
    const blindBox = await blindBoxService.getById(id);
    res.json({ 
      success: true,
      data: blindBox,
      requestUser: req.user // 返回请求用户信息
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/blindboxes/{id}/draw:
 *   post:
 *     summary: 抽取盲盒
 *     tags: [盲盒]
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
 *         description: 抽取结果
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
 */
router.post('/:id/draw', async (req: AuthenticatedRequest, res, next) => {
  try {
    // 详细验证用户信息
    if (!req.user) {
      logger.error('抽取盲盒时未获取到用户信息，完整请求头:', req.headers);
      throw new ApiError(401, '用户未认证');
    }

    logger.info(`用户 ${req.user.id} 正在抽取盲盒 ${req.params.id}`);
    
    const result = await blindBoxService.draw(
      parseInt(req.params.id),
      req.user.id
    );
    
    logger.debug(`抽取结果: ${JSON.stringify(result)}`);
    
    res.json({
      success: true,
      data: result,
      drawnBy: { // 返回抽取者信息
        userId: req.user.id,
        username: req.user.username
      }
    });
  } catch (error) {
    logger.error('抽取盲盒错误:', error);
    next(error);
  }
});

export { router as blindboxRouter };