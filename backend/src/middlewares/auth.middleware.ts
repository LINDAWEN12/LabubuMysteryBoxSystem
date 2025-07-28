import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { getRepository } from 'typeorm';
import { User } from '../entities/user.entity';
import { ApiError } from '../utils/api-error';
import { AuthenticatedRequest } from '../types/custom-request';

export async function authMiddleware(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  // 1. 白名单检查（不需要认证的路由）
  const whitelist = [
    '/api/auth/login',
    '/api/auth/register',

  ];
  
  if (whitelist.includes(req.path)) {
    return next();
  }

  // 2. 严格检查Authorization头
  const authHeader = req.headers['authorization'] || req.header('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return next(new ApiError(401, '认证失败：缺少有效的Authorization头'));
  }

  // 3. 提取并验证Token
  const token = authHeader.split(' ')[1].trim();
  if (!token) {
     console.error('错误：请求头缺少Authorization字段');
    return next(new ApiError(401, '认证失败：Token不能为空'));
  }

  try {
    // 4. 解码Token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as { userId: number };
    
    // 5. 从数据库获取完整用户信息
    const userRepository = getRepository(User);
    const user = await userRepository.findOne({
      where: { id: decoded.userId },
      select: ['id', 'username', 'balance', 'avatar'], // 只选择需要的字段
      cache: true
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

    next();
  } catch (error) {
    // 8. 更详细的错误处理
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

    next(new ApiError(401, errorMessage));
  }
}