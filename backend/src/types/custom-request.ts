import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    username: string;
     balance?: number;  // 添加balance
     avatar?: string;  // 可选头像字段
  };
}