import { Request, Response, NextFunction } from 'express';
import { InInstantwinNodeService } from '../../services/in_instantwin_node_service';
import { ResponseHelper } from '../../utils/response';
import { NodeValidator } from './utils/node_validator';
import { NODE_CONSTANTS } from './utils/node_constants';
import { NodeUpdateRequest } from './types/node_request';

export const putInInstantwinNode = async (
  req: Request<
    { id: string },
    Record<string, never>,
    NodeUpdateRequest,
    Record<string, never>
  >,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const idValidation = NodeValidator.validateId(req.params.id);
    if (!idValidation.isValid) {
      ResponseHelper.badRequest(res, idValidation.error || '無効なノードIDです');
      return;
    }

    const nodeId = idValidation.numericId!;

    // Validate request body
    const validation = NodeValidator.validateUpdateRequest(req.body);
    if (!validation.isValid) {
      ResponseHelper.badRequest(res, '入力値に不正があります', {
        code: NODE_CONSTANTS.ERROR_CODES.VALIDATION_ERROR,
        details: validation.errors.map(error => ({ message: error })),
      });
      return;
    }

    // Update node
    const updatedNode = await InInstantwinNodeService.updateNode(nodeId, req.body);

    ResponseHelper.success(res, true, NODE_CONSTANTS.MESSAGES.NODE_UPDATED);
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

export default putInInstantwinNode;