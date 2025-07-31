/**
 * 自定义API错误类
 * 用于标准化API错误响应，支持各种HTTP状态码和错误消息
 * 继承自原生Error类，提供更多错误上下文信息
 */
export class ApiError extends Error {
  /**
   * HTTP状态码
   * 表示错误的类型，如400表示请求错误，401表示未授权等
   * @type {number}
   */
  public readonly statusCode: number;
  /**
   * 是否为操作错误
   * 用于区分可预见的业务错误和不可预见的系统错误
   * true: 可预见的业务错误，false: 不可预见的系统错误
   * @type {boolean}
   */
  public readonly isOperational: boolean;

  /**
   * 构造函数
   * @param statusCode - HTTP状态码
   * @param message - 错误消息
   * @param isOperational - 是否为操作错误，默认为true
   */
  constructor(
    statusCode: number, 
    message: string,
    isOperational: boolean = true
  ) {
    super(message);
    
    // 保持正确的原型链（重要！）
    // 确保实例能够正确访问类的方法和属性
    Object.setPrototypeOf(this, new.target.prototype);
    
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    
    // 捕获堆栈跟踪（排除构造函数调用）
    // 使错误堆栈更加清晰，不包含构造函数本身的调用
    Error.captureStackTrace(this, this.constructor);
  }

  /**
   * 请求错误 (400)
   * 用于处理无效的请求参数、格式错误等
   * @param message - 错误消息
   * @returns {ApiError} - 返回ApiError实例
   */
  static badRequest(message: string) {
    return new ApiError(400, message);
  }

  /**
   * 未授权错误 (401)
   * 用于处理认证失败、缺少Token等情况
   * @param message - 错误消息，默认为'未授权'
   * @returns {ApiError} - 返回ApiError实例
   */
  static unauthorized(message: string = '未授权') {
    return new ApiError(401, message);
  }

  /**
   * 禁止访问错误 (403)
   * 用于处理权限不足的情况
   * @param message - 错误消息，默认为'禁止访问'
   * @returns {ApiError} - 返回ApiError实例
   */
  static forbidden(message: string = '禁止访问') {
    return new ApiError(403, message);
  }

  /**
   * 资源未找到错误 (404)
   * 用于处理请求的资源不存在的情况
   * @param message - 错误消息，默认为'资源未找到'
   * @returns {ApiError} - 返回ApiError实例
   */
  static notFound(message: string = '资源未找到') {
    return new ApiError(404, message);
  }

  /**
   * 服务器内部错误 (500)
   * 用于处理不可预见的服务器错误
   * @param message - 错误消息，默认为'服务器内部错误'
   * @returns {ApiError} - 返回ApiError实例
   */
  static internalError(message: string = '服务器内部错误') {
    return new ApiError(500, message);
  }
}