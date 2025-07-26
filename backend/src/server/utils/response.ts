import { Response } from 'express';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export class ResponseHelper {
  static success<T>(
    res: Response,
    data?: T,
    message?: string
  ): Response<ApiResponse<T>> {
    return res.status(200).json({
      success: true,
      data,
      message,
    });
  }

  static created<T>(
    res: Response,
    data?: T,
    message?: string
  ): Response<ApiResponse<T>> {
    return res.status(201).json({
      success: true,
      data,
      message: message || 'リソースが正常に作成されました',
    });
  }

  static updated<T>(
    res: Response,
    data?: T,
    message?: string
  ): Response<ApiResponse<T>> {
    return res.status(200).json({
      success: true,
      data,
      message: message || 'リソースが正常に更新されました',
    });
  }

  static deleted(res: Response, message?: string): Response<ApiResponse> {
    return res.status(200).json({
      success: true,
      message: message || 'リソースが正常に削除されました',
    });
  }

  static paginated<T>(
    res: Response,
    data: T[],
    page: number,
    limit: number,
    total: number,
    message?: string
  ): Response<ApiResponse<T[]>> {
    const totalPages = Math.ceil(total / limit);

    return res.status(200).json({
      success: true,
      data,
      message,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    });
  }

  static badRequest(
    res: Response,
    message?: string,
    error?: any
  ): Response<ApiResponse> {
    return res.status(400).json({
      success: false,
      message: message || '無効なリクエストです',
      error,
    });
  }

  static unauthorized(res: Response, message?: string): Response<ApiResponse> {
    return res.status(401).json({
      success: false,
      message: message || '認証が必要です',
    });
  }

  static forbidden(res: Response, message?: string): Response<ApiResponse> {
    return res.status(403).json({
      success: false,
      message: message || 'アクセスが拒否されました',
    });
  }

  static notFound(res: Response, message?: string, code?: string): Response<ApiResponse> {
    return res.status(404).json({
      success: false,
      message: message || 'リソースが見つかりません',
      error: code ? { code } : undefined,
    });
  }

  static conflict(res: Response, message?: string, error?: any): Response<ApiResponse> {
    return res.status(409).json({
      success: false,
      message: message || 'リソースが競合しています',
      error,
    });
  }

  static internalError(
    res: Response,
    message?: string,
    error?: string
  ): Response<ApiResponse> {
    return res.status(500).json({
      success: false,
      message: message || '内部サーバーエラーが発生しました',
      error: process.env.NODE_ENV === 'development' ? error : undefined,
    });
  }
}

export default ResponseHelper;
