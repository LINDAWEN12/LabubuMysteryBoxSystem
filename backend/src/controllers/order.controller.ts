import { Router } from 'express';
import { OrderService } from '../services/order.service';
import { AuthenticatedRequest } from '../types/custom-request';
import { ApiError } from '../utils/api-error';

const router = Router();
let orderService: OrderService;
/**
 * @swagger
 * tags:
 *   name: 订单
 *   description: 订单管理
 */

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: 获取用户订单历史
 *     tags: [订单]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: 页码
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: 每页数量
 *     responses:
 *       200:
 *         description: 订单列表
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
 *                     $ref: '#/components/schemas/Order'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                       example: 100
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     limit:
 *                       type: integer
 *                       example: 10
 *                     totalPages:
 *                       type: integer
 *                       example: 10
 *       401:
 *         description: 未授权
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
// 添加初始化中间件
router.use(async (req, res, next) => {
  if (!orderService) {
    orderService = await OrderService.createInstance();
  }
  next();
});

// 获取用户所有订单
router.get('/', async (req: AuthenticatedRequest, res, next) => {
  try {
    if (!req.user) throw new ApiError(401, '请先登录');
    
    const orders = await orderService.getUserOrders(req.user.id);
    res.json({
      success: true,
      data: orders
    });
  } catch (error) {
    next(error);
  }
});

// 获取单个订单详情
router.get('/:id', async (req: AuthenticatedRequest, res, next) => {
  try {
    if (!req.user) throw new ApiError(401, '请先登录');
    
    const order = await orderService.getOrderById(
      parseInt(req.params.id),
      req.user.id
    );
    
    if (!order) {
      throw new ApiError(404, '订单不存在');
    }
    
    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
});

export const orderRouter = router;