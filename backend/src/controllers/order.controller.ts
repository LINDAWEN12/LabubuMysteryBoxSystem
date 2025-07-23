import { Router } from 'express';
import { OrderService } from '../services/order.service';

const router = Router();
const orderService = new OrderService();

// 获取用户所有订单
router.get('/', async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: '请先登录' });
  }

  try {
    const orders = await orderService.getUserOrders(req.user.id);
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: '获取订单失败' });
  }
});

// 获取单个订单详情
router.get('/:id', async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: '请先登录' });
  }

  try {
    const order = await orderService.getOrderById(
      parseInt(req.params.id),
      req.user.id
    );
    
    if (!order) {
      return res.status(404).json({ error: '订单不存在' });
    }
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: '获取订单详情失败' });
  }
});

export default router;