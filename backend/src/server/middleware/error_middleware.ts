import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';
import { ResponseHelper } from '../utils/response';

export interface CustomError extends Error {
  statusCode?: number;
  details?: any;
}

export const errorHandler = (
  error: CustomError,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  // ヘッダーが既に送信されている場合は何もしない
  if (res.headersSent) {
    return _next(error);
  }

  logger.error('エラーが発生しました:', {
    message: error.message,
    stack: error.stack,
    statusCode: error.statusCode,
    url: req.url,
    method: req.method,
    body: req.body,
    params: req.params,
    query: req.query,
  });

  // Sequelize バリデーションエラー
  if (error.name === 'SequelizeValidationError') {
    const validationErrors = (error as any).errors.map((err: any) => ({
      field: err.path,
      message: err.message,
    }));

    return ResponseHelper.badRequest(
      res,
      'バリデーションエラーが発生しました',
      validationErrors
    );
  }

  // Sequelize ユニーク制約エラー
  if (error.name === 'SequelizeUniqueConstraintError') {
    return ResponseHelper.conflict(res, '重複するデータが存在します');
  }

  // Sequelize 外部キー制約エラー
  if (error.name === 'SequelizeForeignKeyConstraintError') {
    return ResponseHelper.badRequest(res, '関連するデータが存在しません');
  }

  // JWT エラー
  if (error.name === 'JsonWebTokenError') {
    return ResponseHelper.unauthorized(res, '無効なトークンです');
  }

  if (error.name === 'TokenExpiredError') {
    return ResponseHelper.unauthorized(res, 'トークンが期限切れです');
  }

  // カスタムエラー
  const statusCode = error.statusCode || 500;
  const message = error.message || 'サーバー内部エラーが発生しました';

  if (statusCode === 400) {
    return ResponseHelper.badRequest(res, message, error.details);
  } else if (statusCode === 401) {
    return ResponseHelper.unauthorized(res, message);
  } else if (statusCode === 403) {
    return ResponseHelper.forbidden(res, message);
  } else if (statusCode === 404) {
    return ResponseHelper.notFound(res, message);
  } else if (statusCode === 409) {
    return ResponseHelper.conflict(res, message);
  } else {
    return ResponseHelper.internalError(res, message, error.stack);
  }
};

export const notFoundHandler = (req: Request, res: Response): void => {
  const details = {
    path: req.url,
    method: req.method
  };
  ResponseHelper.notFound(
    res,
    'リクエストされたリソースが見つかりません',
    details
  );
};

export default errorHandler;
