import { Router } from 'express';
import { BlindBoxService } from '../services/blindbox.service';
import { AuthenticatedRequest } from '../types/custom-request';
import { ApiError } from '../utils/api-error';
import { AppDataSource } from '../config/database';
import { logger } from '../utils/logger';

const router = Router();
let blindBoxService: BlindBoxService;
// 在控制器顶部添加响应格式类型
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}
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
    const blindBoxes = await blindBoxService.getAll();
    
    // 确保返回数组格式
    if (!Array.isArray(blindBoxes)) {
      throw new ApiError(500, '获取盲盒数据格式错误');
    }
    
    // 统一响应结构
    const response: ApiResponse<typeof blindBoxes> = {
      success: true,
      data: blindBoxes,
      message: '盲盒列表获取成功'
    };
    
    res.json(response);
    
    logger.info(`成功返回 ${blindBoxes.length} 个盲盒`);
  } catch (error) {
    logger.error('获取盲盒列表错误:', error);
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
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      throw new ApiError(400, '无效的盲盒ID');
    }
    
    logger.debug(`获取盲盒详情请求，用户ID: ${req.user?.id}, 盲盒ID: ${id}`);
    
    const blindBox = await blindBoxService.getById(id);
    
    if (!blindBox) {
      throw new ApiError(404, '盲盒未找到');
    }
    
    const response: ApiResponse<typeof blindBox> = {
      success: true,
      data: blindBox,
      message: '盲盒详情获取成功'
    };
    
    res.json(response);
    
  } catch (error) {
    logger.error(`获取盲盒详情错误，ID: ${req.params.id}`, error);
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
    if (!req.user) {
      logger.error('抽取盲盒时未获取到用户信息', {
        headers: req.headers,
        ip: req.ip
      });
      throw new ApiError(401, '用户未认证');
    }

    const boxId = parseInt(req.params.id);
    if (isNaN(boxId)) {
      throw new ApiError(400, '无效的盲盒ID');
    }
    
    logger.info(`用户 ${req.user.id} 正在抽取盲盒 ${boxId}`);
    
    const result = await blindBoxService.draw(boxId, req.user.id);
    
    const response: ApiResponse<typeof result> = {
      success: true,
      data: result,
      message: '盲盒抽取成功'
    };
    
    res.json(response);
    
  } catch (error) {
    logger.error('抽取盲盒错误:', {
      userId: req.user?.id,
      boxId: req.params.id
    });
    next(error);
  }
});
export { router as blindboxRouter };