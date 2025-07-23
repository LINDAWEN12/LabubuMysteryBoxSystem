export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(
    statusCode: number, 
    message: string,
    isOperational: boolean = true
  ) {
    super(message);
    
    // 保持正确的原型链（重要！）
    Object.setPrototypeOf(this, new.target.prototype);
    
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    
    // 捕获堆栈跟踪（排除构造函数调用）
    Error.captureStackTrace(this, this.constructor);
  }

  // 常用错误类型的快捷方式
  static badRequest(message: string) {
    return new ApiError(400, message);
  }

  static unauthorized(message: string = '未授权') {
    return new ApiError(401, message);
  }

  static forbidden(message: string = '禁止访问') {
    return new ApiError(403, message);
  }

  static notFound(message: string = '资源未找到') {
    return new ApiError(404, message);
  }

  static internalError(message: string = '服务器内部错误') {
    return new ApiError(500, message);
  }
}