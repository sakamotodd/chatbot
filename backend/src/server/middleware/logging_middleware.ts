import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

export const loggingMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const start = Date.now();

  // リクエスト情報をログに記録
  logger.info('Request received', {
    method: req.method,
    url: req.url,
    userAgent: req.get('User-Agent'),
    ip: req.ip,
    timestamp: new Date().toISOString(),
  });

  // レスポンス完了時のログ記録
  res.on('finish', () => {
    const duration = Date.now() - start;

    logger.info('Request completed', {
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      timestamp: new Date().toISOString(),
    });
  });

  next();
};

export default loggingMiddleware;
