/**
 * 盲盒控制器
 * 处理盲盒相关的HTTP请求，包括获取盲盒列表、详情和抽取盲盒等功能
 */
import { Router } from 'express';
import { BlindBoxService } from '../services/blindbox.service';
import { AuthenticatedRequest } from '../types/custom-request';
import { ApiError } from '../utils/api-error';
import { AppDataSource } from '../config/database';
import { logger } from '../utils/logger';

const router = Router();
let blindBoxService: BlindBoxService;

/**
 * API响应格式接口
 * 用于标准化API响应结构
 * @template T - 响应数据的类型
 */
interface ApiResponse<T> {
  success: boolean;     // 操作是否成功
  data?: T;             // 响应数据
  message?: string;     // 响应消息
}

/**
 * 初始化中间件
 * 确保BlindBoxService实例被正确初始化
 */
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
/**
 * 获取所有盲盒列表
 * @param req - 经过认证的请求对象
 * @param res - 响应对象
 * @param next - 下一步函数
 * @returns {Promise<void>} - 返回Promise
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
/**
 * 获取盲盒详情
 * @param req - 经过认证的请求对象
 * @param res - 响应对象
 * @param next - 下一步函数
 * @returns {Promise<void>} - 返回Promise
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
/**
 * 抽取盲盒
 * @param req - 经过认证的请求对象
 * @param res - 响应对象
 * @param next - 下一步函数
 * @returns {Promise<void>} - 返回Promise
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