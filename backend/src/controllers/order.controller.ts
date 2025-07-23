import { Router } from 'express';
import { OrderService } from '../services/order.service';
import { AuthenticatedRequest } from '../types/custom-request';
import { ApiError } from '../utils/api-error';

const router = Router();
let orderService: OrderService;

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