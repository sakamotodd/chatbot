import { Request, Response, NextFunction } from 'express';
import { InInstantwinNodeService } from '../../services/in_instantwin_node_service';
import { ResponseHelper } from '../../utils/response';
import { NodeValidator } from './utils/node_validator';
import { NODE_CONSTANTS } from './utils/node_constants';
import { NodeCreateRequest } from './types/node_request';

export const postInInstantwinNode = async (
  req: Request<
    Record<string, never>,
    Record<string, never>,
    NodeCreateRequest,
    Record<string, never>
  >,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Validate request body
    const validation = NodeValidator.validateCreateRequest(req.body);
    if (!validation.isValid) {
      ResponseHelper.badRequest(res, '入力値に不正があります', {
        code: NODE_CONSTANTS.ERROR_CODES.VALIDATION_ERROR,
        details: validation.errors.map(error => ({ message: error })),
      });
      return;
    }

    // Create node
    const node = await InInstantwinNodeService.createNode(req.body);

    ResponseHelper.created(res, true, NODE_CONSTANTS.MESSAGES.NODE_CREATED);
  } catch (error: any) {
    if (error.statusCode === 404) {
      ResponseHelper.notFound(res, error.message, error.code);
      return;
    }
    if (error.statusCode === 400) {
      ResponseHelper.badRequest(res, error.message, {
        code: error.code,
      });
      return;
    }
    next(error);
  }
};

export default postInInstantwinNode;