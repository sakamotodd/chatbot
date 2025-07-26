import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { ResponseHelper } from '../utils/response';

export interface ValidationSchemas {
  body?: Joi.ObjectSchema;
  query?: Joi.ObjectSchema;
  params?: Joi.ObjectSchema;
}

export const validate = (schemas: ValidationSchemas) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const errors: string[] = [];

    // Body validation
    if (schemas.body) {
      const { error } = schemas.body.validate(req.body);
      if (error) {
        errors.push(
          `Body: ${error.details.map(detail => detail.message).join(', ')}`
        );
      }
    }

    // Query validation
    if (schemas.query) {
      const { error } = schemas.query.validate(req.query);
      if (error) {
        errors.push(
          `Query: ${error.details.map(detail => detail.message).join(', ')}`
        );
      }
    }

    // Params validation
    if (schemas.params) {
      const { error } = schemas.params.validate(req.params);
      if (error) {
        errors.push(
          `Params: ${error.details.map(detail => detail.message).join(', ')}`
        );
      }
    }

    if (errors.length > 0) {
      ResponseHelper.badRequest(
        res,
        'バリデーションエラーが発生しました',
        errors.join('; ')
      );
      return;
    }

    next();
  };
};

// Common validation schemas
export const commonSchemas = {
  id: Joi.object({
    id: Joi.number().integer().positive().required(),
  }),

  pagination: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20),
  }),

  search: Joi.object({
    q: Joi.string().allow('').optional(),
    sort: Joi.string().valid('asc', 'desc').default('desc'),
    sortBy: Joi.string().optional(),
  }),
};

export default validate;
