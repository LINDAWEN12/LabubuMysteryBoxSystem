import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { getRepository } from 'typeorm';
import { User } from '../entities/user.entity';
import { ApiError } from '../utils/api-error';

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // 白名单路由不需要认证
  if (['/api/auth/login', '/api/auth/register'].includes(req.path)) {
    return next();
  }

  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    throw new ApiError(401, 'Authorization header missing');
  }

  const token = authHeader.split(' ')[1];
  
  try {
    const decoded = jwt.verify(
      token, 
      process.env.JWT_SECRET || 'your-secret-key'
    ) as { userId: number };
    
    // 从数据库获取完整用户信息
    const userRepository = getRepository(User);
    const user = await userRepository.findOne({
      where: { id: decoded.userId },
      select: ['id', 'username', 'avatar']
    });
    
    if (!user) {
      throw new ApiError(401, 'User not found');
    }

    req.user = {
      id: user.id,
      username: user.username
    };
    
    next();
  } catch (error) {
    throw new ApiError(401, 'Invalid token');
  }
}