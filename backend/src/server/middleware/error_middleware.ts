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

    ResponseHelper.badRequest(
      res,
      'バリデーションエラーが発生しました',
      validationErrors
    );
    return;
  }

  // Sequelize ユニーク制約エラー
  if (error.name === 'SequelizeUniqueConstraintError') {
    ResponseHelper.conflict(res, '重複するデータが存在します');
    return;
  }

  // Sequelize 外部キー制約エラー
  if (error.name === 'SequelizeForeignKeyConstraintError') {
    ResponseHelper.badRequest(res, '関連するデータが存在しません');
    return;
  }

  // JWT エラー
  if (error.name === 'JsonWebTokenError') {
    ResponseHelper.unauthorized(res, '無効なトークンです');
    return;
  }

  if (error.name === 'TokenExpiredError') {
    ResponseHelper.unauthorized(res, 'トークンが期限切れです');
    return;
  }

  // カスタムエラー
  const statusCode = error.statusCode || 500;
  const message = error.message || '内部サーバーエラーが発生しました';

  if (statusCode === 400) {
    ResponseHelper.badRequest(res, message, error.details);
  } else if (statusCode === 401) {
    ResponseHelper.unauthorized(res, message);
  } else if (statusCode === 403) {
    ResponseHelper.forbidden(res, message);
  } else if (statusCode === 404) {
    ResponseHelper.notFound(res, message);
  } else if (statusCode === 409) {
    ResponseHelper.conflict(res, message);
  } else {
    ResponseHelper.internalError(res, message, error.stack);
  }
};

export const notFoundHandler = (req: Request, res: Response): void => {
  ResponseHelper.notFound(
    res,
    `エンドポイント ${req.originalUrl} が見つかりません`
  );
};

export default errorHandler;
