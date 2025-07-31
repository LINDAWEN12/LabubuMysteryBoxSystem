/**
 * 错误处理中间件
 * 统一处理应用程序中的所有错误，提供标准化的错误响应格式
 * 区分自定义ApiError和系统错误，对不同类型的错误提供不同的处理策略
 * 
 * 工作原理：
 * 1. 捕获应用程序中抛出的所有错误
 * 2. 区分自定义ApiError和其他类型的错误
 * 3. 对于自定义ApiError，返回指定的HTTP状态码和错误信息
 * 4. 对于系统错误，返回500状态码和通用错误信息，并记录错误堆栈
 */
import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/api-error';
import { logger } from '../utils/logger';

/**
 * API错误响应格式接口
 */
interface ErrorResponse {
  error: string;  // 错误消息
  details?: any;  // 可选的错误详情
}

/**
 * 错误处理中间件
 * @param error - 捕获到的错误
 * @param req - Express请求对象
 * @param res - Express响应对象
 * @param next - Express下一个中间件函数
 * @returns {void} - 无返回值，直接发送响应
 */
export function errorMiddleware(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  // 记录所有错误的请求信息，便于调试
  logger.error(`请求错误: ${req.method} ${req.path}`, {
    headers: req.headers,
    body: req.body,
    query: req.query,
    params: req.params
  });

  // 区分自定义ApiError和其他错误
  if (error instanceof ApiError) {
    // 处理自定义API错误
    const response: ErrorResponse = {
      error: error.message
    };

    res.status(error.statusCode).json(response);
    logger.warn(`自定义API错误: ${error.statusCode} - ${error.message}`);
  } else {
    // 处理其他未知错误
    logger.error(`系统错误: ${error.message}`, error.stack); // 记录错误堆栈信息

    const response: ErrorResponse = {
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    };

    res.status(500).json(response);
  }
}