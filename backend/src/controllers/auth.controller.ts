/**
 * 认证控制器
 * 处理用户注册、登录等认证相关的HTTP请求
 * 提供与用户身份验证相关的API接口
 */
import { AuthService } from '../services/auth.service';
import { ApiResponse } from '../utils/api-response';
import { RegisterDto, LoginDto } from '../types';
import { Router, Request, Response, NextFunction } from 'express';

const router = Router();
const authService = new AuthService();

/**
 * @swagger
 * tags:
 *   name: 认证
 *   description: 用户认证相关接口
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: 用户注册
 *     tags: [认证]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: "user123"
 *                 description: 用户名，长度限制1-20个字符
 *               password:
 *                 type: string
 *                 example: "password123"
 *                 description: 密码，至少6位字符
 *     responses:
 *       200:
 *         description: 注册成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: 用户名已存在或参数无效
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
 *                   example: "用户名已存在"
 */
/**
 * 用户注册接口
 * @param req - Express请求对象，包含注册信息
 * @param res - Express响应对象，用于返回注册结果
 * @param next - Express下一个中间件函数，用于错误处理
 */
router.post('/register', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const registerDto: RegisterDto = req.body;
    const user = await authService.register(registerDto);
    res.json(ApiResponse.success(user));
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: 用户登录
 *     tags: [认证]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: "user123"
 *               password:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: 登录成功
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
 *                     token:
 *                       type: string
 *                       example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                       description: JWT认证令牌
 *                     user:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: number
 *                         username:
 *                           type: string
 *                         balance:
 *                           type: number
 *                         avatar:
 *                           type: string
 *       401:
 *         description: 用户名或密码错误
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
 *                   example: "用户名或密码错误"
 */
/**
 * 用户登录接口
 * @param req - Express请求对象，包含登录信息
 * @param res - Express响应对象，用于返回登录结果
 * @param next - Express下一个中间件函数，用于错误处理
 */
router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const loginDto: LoginDto = req.body;
    const { token, user } = await authService.login(loginDto);
    
    // 打印调试信息
    console.log('生成的Token:', token);
    console.log('用户数据:', user);
    
    res.json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          username: user.username,
          balance: user.balance,
          avatar: user.avatar || ''
        }
      }
    });
  } catch (error) {
    console.error('登录错误:', error);
    next(error);
  }
});

export default router;