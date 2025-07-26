import { Request, Response, NextFunction } from 'express';
import { errorHandler, notFoundHandler } from '../../../src/server/middleware/error_middleware';

describe('Error Middleware Unit Tests', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockReq = {
      url: '/test-url',
      method: 'GET'
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      headersSent: false
    };
    mockNext = jest.fn();
  });

  describe('Error Handler', () => {
    it('should handle generic errors', () => {
      const error = new Error('Test error message');
      
      errorHandler(error, mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'サーバー内部エラーが発生しました',
        ...(process.env.NODE_ENV === 'development' && {
          error: error.message,
          stack: error.stack
        })
      });
    });

    it('should handle errors with custom status codes', () => {
      const error: any = new Error('Not found');
      error.status = 404;
      
      errorHandler(error, mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false
        })
      );
    });

    it('should not send response if headers already sent', () => {
      const error = new Error('Test error');
      mockRes.headersSent = true;
      
      errorHandler(error, mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
      expect(mockRes.status).not.toHaveBeenCalled();
      expect(mockRes.json).not.toHaveBeenCalled();
    });

    it('should handle validation errors', () => {
      const error: any = new Error('Validation failed');
      error.name = 'ValidationError';
      error.details = [{ message: '必須フィールドが不足しています' }];
      
      errorHandler(error, mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: expect.stringContaining('バリデーションエラー')
        })
      );
    });

    it('should include error details in development mode', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';
      
      const error = new Error('Test error with stack');
      
      errorHandler(error, mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: error.message,
          stack: error.stack
        })
      );

      process.env.NODE_ENV = originalEnv;
    });

    it('should not include error details in production mode', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';
      
      const error = new Error('Test error');
      
      errorHandler(error, mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.json).toHaveBeenCalledWith(
        expect.not.objectContaining({
          error: expect.any(String),
          stack: expect.any(String)
        })
      );

      process.env.NODE_ENV = originalEnv;
    });
  });

  describe('Not Found Handler', () => {
    it('should handle 404 errors', () => {
      notFoundHandler(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'リクエストされたリソースが見つかりません',
        path: mockReq.url,
        method: mockReq.method
      });
    });

    it('should include request details in 404 response', () => {
      mockReq.url = '/api/nonexistent';
      mockReq.method = 'POST';
      
      notFoundHandler(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          path: '/api/nonexistent',
          method: 'POST'
        })
      );
    });
  });
});