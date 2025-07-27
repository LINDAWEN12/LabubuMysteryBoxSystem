import { Router } from 'express';
import { BlindBoxService } from '../services/blindbox.service';
import { AuthenticatedRequest } from '../types/custom-request';
import { ApiError } from '../utils/api-error';
import { AppDataSource } from '../config/database';
const router = Router();
let blindBoxService: BlindBoxService;
/**
 * @swagger
 * tags:
 *   name: 盲盒
 *   description: 盲盒管理与抽取
 */

/**
 * @swagger
 * /api/blindboxes:
 *   get:
 *     summary: 获取所有盲盒列表
 *     tags: [盲盒]
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
// 添加初始化中间件
router.use(async (req, res, next) => {
  if (!blindBoxService) {
    blindBoxService = new BlindBoxService();
  }
  next();
});
/**
 * @swagger
 * /api/blindboxes/{id}:
 *   get:
 *     summary: 获取盲盒详情
 *     tags: [盲盒]
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "盲盒未找到"
 */
router.post('/:id/draw', async (req: AuthenticatedRequest, res, next) => {
  try {
    if (!req.user) throw new ApiError(401, 'Unauthorized');
    
    const result = await blindBoxService.draw(
      parseInt(req.params.id),
      req.user.id
    );
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
 *       400:
 *         description: 余额不足
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "余额不足"
 *       404:
 *         description: 盲盒未找到
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "盲盒未找到"
 */   
    res.json(result);
  } catch (error) {
    next(error); // 将错误传递给 errorMiddleware
  }
});

export { router as blindboxRouter };