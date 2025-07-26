import { Request, Response, NextFunction } from 'express';
import { validate } from '../../../src/server/middleware/validation_middleware';
import Joi from 'joi';

describe('Validation Middleware Unit Tests', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockReq = {
      body: {},
      params: {},
      query: {}
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    mockNext = jest.fn();
  });

  describe('Body Validation', () => {
    const bodySchema = Joi.object({
      title: Joi.string().required(),
      description: Joi.string().optional()
    });

    it('should pass validation with valid body data', () => {
      mockReq.body = { title: 'Test Title', description: 'Test Description' };
      
      const middleware = validate({ body: bodySchema });
      middleware(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
    });

    it('should fail validation with invalid body data', () => {
      mockReq.body = { description: 'Missing title' }; // title is required
      
      const middleware = validate({ body: bodySchema });
      middleware(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: expect.stringContaining('バリデーションエラー')
        })
      );
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  describe('Params Validation', () => {
    const paramsSchema = Joi.object({
      id: Joi.number().integer().positive().required()
    });

    it('should pass validation with valid params', () => {
      mockReq.params = { id: '123' };
      
      const middleware = validate({ params: paramsSchema });
      middleware(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });

    it('should fail validation with invalid params', () => {
      mockReq.params = { id: 'invalid' };
      
      const middleware = validate({ params: paramsSchema });
      middleware(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  describe('Query Validation', () => {
    const querySchema = Joi.object({
      page: Joi.number().integer().min(1).default(1),
      limit: Joi.number().integer().min(1).max(100).default(10)
    });

    it('should pass validation for empty query params', () => {
      mockReq.query = {};
      
      const middleware = validate({ query: querySchema });
      middleware(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
    });

    it('should pass validation with valid query params', () => {
      mockReq.query = { page: '2', limit: '20' };
      
      const middleware = validate({ query: querySchema });
      middleware(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
    });
  });

  describe('Multiple Schema Validation', () => {
    const bodySchema = Joi.object({
      title: Joi.string().required()
    });
    const paramsSchema = Joi.object({
      id: Joi.number().integer().positive().required()
    });

    it('should validate all provided schemas', () => {
      mockReq.body = { title: 'Test' };
      mockReq.params = { id: '1' };
      
      const middleware = validate({ 
        body: bodySchema, 
        params: paramsSchema 
      });
      middleware(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });

    it('should fail if any schema validation fails', () => {
      mockReq.body = { title: 'Test' };
      mockReq.params = { id: 'invalid' }; // Invalid param
      
      const middleware = validate({ 
        body: bodySchema, 
        params: paramsSchema 
      });
      middleware(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockNext).not.toHaveBeenCalled();
    });
  });
});