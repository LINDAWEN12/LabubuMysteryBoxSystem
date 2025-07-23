import { Router } from 'express';
import { ShowcaseService } from '../services/showcase.service';
import { AuthenticatedRequest } from '../types/custom-request';
import { ApiError } from '../utils/api-error';

const router = Router();
let showcaseService: ShowcaseService;

// 添加初始化中间件
router.use(async (req, res, next) => {
  if (!showcaseService) {
    showcaseService = await ShowcaseService.createInstance();
  }
  next();
});

// 获取所有玩家秀
router.get('/', async (req, res, next) => {
  try {
    const showcases = await showcaseService.getAll();
    res.json({
      success: true,
      data: showcases
    });
  } catch (error) {
    next(error);
  }
});

// 创建玩家秀
router.post('/', async (req: AuthenticatedRequest, res, next) => {
  try {
    if (!req.user) throw new ApiError(401, '请先登录');
    
    const showcase = await showcaseService.create({
      ...req.body,
      userId: req.user.id
    });
    
    res.status(201).json({
      success: true,
      data: showcase
    });
  } catch (error) {
    next(error);
  }
});

// 删除玩家秀
router.delete('/:id', async (req: AuthenticatedRequest, res, next) => {
  try {
    if (!req.user) throw new ApiError(401, '请先登录');
    
    const success = await showcaseService.delete(
      parseInt(req.params.id),
      req.user.id
    );
    
    if (!success) {
      throw new ApiError(404, '玩家秀不存在或无权删除');
    }
    
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

export const showcaseRouter = router;