import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/api-error';
import { logger } from '../utils/logger';

export function errorMiddleware(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (error instanceof ApiError) {
    res.status(error.statusCode).json({
      error: error.message
    });
  } else {
    logger.error(error.stack);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
}