import { Response } from 'express';

export interface CustomResponse extends Response {
  success: <T>(data: T) => void;
  error: (message: string, statusCode?: number) => void;
}

export class ApiResponse<T> {
  constructor(
    public success: boolean,
    public data?: T,
    public error?: string,
    public code?: number
  ) {}

  static success<T>(data: T): ApiResponse<T> {
    return new ApiResponse(true, data);
  }

  static error(message: string, code = 400): ApiResponse<null> {
    return new ApiResponse(false, null, message, code);
  }

  /**
   * 扩展Express Response对象
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