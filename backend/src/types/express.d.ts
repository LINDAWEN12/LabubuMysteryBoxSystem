import 'express';
import 'express-serve-static-core';
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        username: string;
      };
    }

    interface Response {
      /**
       * 成功响应方法
       * @param data 响应数据
       */
      success: <T>(data: T) => void;
      
      /**
       * 错误响应方法
       * @param message 错误信息
       * @param statusCode HTTP状态码，默认400
       */
      error: (message: string, statusCode?: number) => void;
    }
  }
}