/**
 * 认证中间件
 * 处理基于JWT的用户身份验证，保护需要认证的路由
 * 实现了白名单检查、Token验证、用户信息获取等功能
 */
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { getRepository } from 'typeorm';
import { User } from '../entities/user.entity';
import { ApiError } from '../utils/api-error';
import { AuthenticatedRequest } from '../types/custom-request';
import { AppDataSource } from '../config/database';
/**
 * 认证中间件函数
 * 用于验证请求中的JWT令牌，并将认证后的用户信息附加到请求对象
 * @param req - Express请求对象，扩展为包含用户信息的AuthenticatedRequest
 * @param res - Express响应对象
 * @param next - Express下一步函数
 * @returns {Promise<void>} - 返回Promise，无具体返回值
 */
export async function authMiddleware(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  // 1. 白名单检查（不需要认证的路由）
  const whitelist = [
    '/api/auth/login',    // 登录路由
    '/api/auth/register', // 注册路由
  ];
  
  if (whitelist.includes(req.path)) {
    return next(); // 白名单路由直接放行
  }

  // 2. 严格检查Authorization头
  const authHeader = req.headers['authorization'] || req.header('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return next(new ApiError(401, '认证失败：缺少有效的Authorization头')); // 格式错误
  }

  // 3. 提取并验证Token
  const token = authHeader.split(' ')[1].trim();
  if (!token) {
     console.error('错误：请求头缺少Authorization字段');
    return next(new ApiError(401, '认证失败：Token不能为空')); // Token缺失
  }

  try {
    // 4. 解码Token
    // 使用环境变量中的JWT_SECRET进行验证，确保签名有效
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as { userId: number };
    
    // 5. 从数据库获取完整用户信息
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({
      where: { id: decoded.userId },
      select: ['id', 'username', 'balance', 'avatar'], // 只选择需要的字段，避免暴露敏感信息
      cache: true // 启用缓存提高性能
    });

    if (!user) {
      throw new ApiError(404, '用户不存在或已被删除');
    }

    // 6. 将用户信息附加到req对象
    req.user = {
      id: user.id,
      username: user.username,
      balance: user.balance,
      avatar: user.avatar
    };

    // 7. 添加调试日志（开发环境）
    if (process.env.NODE_ENV === 'development') {
      console.log('[认证成功] 用户:', req.user);
    }

    next(); // 认证成功，继续处理请求
  } catch (error) {
    // 8. 详细的错误处理
    let errorMessage = '认证失败';
    
    if (error instanceof jwt.TokenExpiredError) {
      errorMessage = 'Token已过期';
    } else if (error instanceof jwt.JsonWebTokenError) {
      errorMessage = '无效的Token';
    } else if (error instanceof ApiError) {
      errorMessage = error.message;
    }

    if (process.env.NODE_ENV === 'development') {
      console.error('[认证错误]', error);
    }

    next(new ApiError(401, errorMessage)); // 传递错误给错误处理中间件
  }
}