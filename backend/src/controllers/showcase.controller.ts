import { Router } from 'express';
import { ShowcaseService } from '../services/showcase.service';
import { AuthenticatedRequest } from '../types/custom-request';
import { ApiError } from '../utils/api-error';
import { authMiddleware } from '../middlewares/auth.middleware';
import { upload } from '../utils/fileUpload';

const router = Router();
let showcaseService: ShowcaseService;
/**
 * @swagger
 * tags:
 *   name: 玩家秀
 *   description: 玩家展示抽到的物品
 */

/**
 * @swagger
 * /api/showcases:
 *   get:
 *     summary: 获取所有玩家秀
 *     tags: [玩家秀]
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
 *       - in: query
 *         name: userId
 *         schema:
 *           type: integer
 *         description: 按用户ID筛选
 *     responses:
 *       200:
 *         description: 玩家秀列表
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
 *                     $ref: '#/components/schemas/Showcase'
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
 */

/**
 * @swagger
 * /api/showcases:
 *   post:
 *     summary: 创建玩家秀
 *     tags: [玩家秀]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - itemId
 *               - image
 *             properties:
 *               itemId:
 *                 type: integer
 *                 example: 1
 *                 description: 关联的物品ID
 *               image:
 *                 type: string
 *                 example: "https://example.com/showcase.jpg"
 *                 description: 展示图片URL
 *               comment:
 *                 type: string
 *                 example: "这是我抽到的稀有物品！"
 *                 description: 玩家评论
 *     responses:
 *       201:
 *         description: 创建成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Showcase'
 *       400:
 *         description: 参数错误
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: 未授权
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: 物品未找到
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/showcases/{id}:
 *   delete:
 *     summary: 删除玩家秀
 *     tags: [玩家秀]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 玩家秀ID
 *     responses:
 *       204:
 *         description: 删除成功
 *       401:
 *         description: 未授权
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: 无权操作
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: 玩家秀不存在
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
// 添加初始化中间件
router.use(async (req, res, next) => {
  if (!showcaseService) {
    showcaseService = await ShowcaseService.createInstance();
  }
  next();
});

// 确保返回的图片路径是完整的URL或正确的相对路径
router.get('/', async (req, res, next) => {
  try {
    const showcases = await showcaseService.getAll();
    
    // 处理图片路径
    const processedShowcases = showcases.map(showcase => ({
      ...showcase,
      image: showcase.image.startsWith('http') || showcase.image.startsWith('/uploads/') ? 
             showcase.image : 
             `/uploads/showcases/${showcase.image}`
    }));
    
    res.json({
      success: true,
      data: processedShowcases
    });
  } catch (error) {
    next(error);
  }
});
// 创建玩家秀
router.post(
  '/',
  authMiddleware, // 先验证身份
  upload.single('image'), // 处理文件上传
  async (req: AuthenticatedRequest, res, next) => {
    try {
      if (!req.file) {
        throw new ApiError(400, '请上传图片');
      }

      const { comment, itemId } = req.body;
      if (!req.user) throw new ApiError(403, '请先登录');
      // 现在 TypeScript 知道 req.user 一定存在（因为经过了 authMiddleware）
      const showcase = await showcaseService.create({
        image: `/uploads/${req.file.filename}`,
        comment,
        itemId,
        user: { id: req.user.id }
      });

      res.json(showcase);
    } catch (error) {
      next(error);
    }
  }
);
// 删除玩家秀
router.delete('/:id', authMiddleware, async (req: AuthenticatedRequest, res, next) => {
  try {
    if (!req.user) throw new ApiError(403, '请先登录');
    
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