import { Router } from 'express';
import { BlindBoxService } from '../services/blindbox.service';
import { AuthenticatedRequest } from '../types/custom-request';
import { ApiError } from '../utils/api-error';
import { AppDataSource } from '../config/database';
const router = Router();
let blindBoxService: BlindBoxService;

// 添加初始化中间件
router.use(async (req, res, next) => {
  if (!blindBoxService) {
    blindBoxService = new BlindBoxService();
  }
  next();
});

router.post('/:id/draw', async (req: AuthenticatedRequest, res, next) => {
  try {
    if (!req.user) throw new ApiError(401, 'Unauthorized');
    
    const result = await blindBoxService.draw(
      parseInt(req.params.id),
      req.user.id
    );
    
    res.json(result);
  } catch (error) {
    next(error); // 将错误传递给 errorMiddleware
  }
});

export { router as blindboxRouter };