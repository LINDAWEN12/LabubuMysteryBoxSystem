import { Router } from 'express';
import { AuthService } from '../services/auth.service';
import { ApiResponse } from '../utils/api-response';
import { RegisterDto, LoginDto } from '../types';

// 创建路由实例
const authRouter = Router();
const authService = new AuthService();

// 用户注册
authRouter.post('/register', async (req, res, next) => {
  try {
    const registerDto: RegisterDto = req.body;
    const user = await authService.register(registerDto);
    res.json(ApiResponse.success(user));
  } catch (error) {
    next(error);
  }
});

// 用户登录
authRouter.post('/login', async (req, res, next) => {
  try {
    const loginDto: LoginDto = req.body;
    const token = await authService.login(loginDto);
    res.json(ApiResponse.success({ token }));
  } catch (error) {
    next(error);
  }
});

// 导出路由实例
export { authRouter }; 