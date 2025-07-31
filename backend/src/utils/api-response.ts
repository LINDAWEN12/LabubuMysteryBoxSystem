/**
 * API响应工具
 * 提供标准化的API响应格式和Express响应对象扩展
 * 统一前后端数据交互格式，简化API响应的创建和发送过程
 * 
 * 核心功能:
 * 1. 定义ApiResponse类，封装标准化的响应结构
 * 2. 提供静态方法快速创建成功或错误响应
 * 3. 扩展Express的Response对象，添加便捷的success和error方法
 */
import { Response } from 'express';

/**
 * 自定义响应接口
 * 扩展Express的Response接口，添加success和error方法
 * 用于简化API响应的发送过程
 */
export interface CustomResponse extends Response {
  /**
   * 发送成功响应
   * @param data - 响应数据，可以是任何类型
   * @returns {void} - 无返回值
   */
  success: <T>(data: T) => void;
  
  /**
   * 发送错误响应
   * @param message - 错误信息
   * @param statusCode - HTTP状态码，默认400
   * @returns {void} - 无返回值
   */
  error: (message: string, statusCode?: number) => void;
}

/**
 * API响应类
 * 用于创建标准化的API响应对象
 * @template T - 响应数据的类型
 */
export class ApiResponse<T> {
  /**
   * 响应是否成功
   */
  public success: boolean;
  
  /**
   * 响应数据(成功时)
   */
  public data?: T;
  
  /**
   * 错误信息(失败时)
   */
  public error?: string;
  
  /**
   * HTTP状态码
   */
  public code?: number;

  /**
   * 构造函数
   * @param success - 响应是否成功
   * @param data - 响应数据(成功时)
   * @param error - 错误信息(失败时)
   * @param code - HTTP状态码
   */
  constructor(
    success: boolean,
    data?: T,
    error?: string,
    code?: number
  ) {
    this.success = success;
    this.data = data;
    this.error = error;
    this.code = code;
  }

  /**
   * 创建成功响应
   * @param data - 响应数据，可以是任何类型
   * @returns {ApiResponse<T>} - 成功响应对象
   */
  static success<T>(data: T): ApiResponse<T> {
    return new ApiResponse(true, data);
  }

  /**
   * 创建错误响应
   * @param message - 错误信息
   * @param code - HTTP状态码，默认400
   * @returns {ApiResponse<null>} - 错误响应对象
   */
  static error(message: string, code = 400): ApiResponse<null> {
    return new ApiResponse(false, null, message, code);
  }

  /**
   * 扩展Express Response对象
   * 添加success和error方法以简化API响应
   * @param res - Express响应对象
   * @returns {CustomResponse} - 扩展后的响应对象
   * 
   * 使用示例:
   * ```
   * router.get('/', (req, res) => {
   *   const customRes = ApiResponse.setupResponseExtensions(res);
   *   customRes.success({ data: 'example' });
   * });
   * ```
   */
  static setupResponseExtensions(res: Response): CustomResponse {
    const customRes = res as CustomResponse;

    customRes.success = function <T>(data: T) {
      this.json(ApiResponse.success(data));
    };

    customRes.error = function (message: string, code = 400) {
      this.status(code).json(ApiResponse.error(message, code));
    };

    return customRes;
  }
}