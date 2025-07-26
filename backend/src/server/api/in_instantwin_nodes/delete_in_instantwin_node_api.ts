import { Request, Response, NextFunction } from 'express';
import { InInstantwinNodeService } from '../../services/in_instantwin_node_service';
import { ResponseHelper } from '../../utils/response';
import { NodeValidator } from './utils/node_validator';
import { NODE_CONSTANTS } from './utils/node_constants';

export const deleteInInstantwinNode = async (
  req: Request<
    { id: string },
    Record<string, never>,
    Record<string, never>,
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

    // Delete node
    const deleteResult = await InInstantwinNodeService.deleteNode(nodeId);

    const responseData = {
      deleted_node_id: nodeId,
      deleted_related_data: deleteResult,
    };

    ResponseHelper.success(res, responseData, NODE_CONSTANTS.MESSAGES.NODE_DELETED);
  } catch (error: any) {
    if (error.statusCode === 404) {
      ResponseHelper.notFound(res, error.message, error.code);
      return;
    }
    next(error);
  }
};

export default deleteInInstantwinNode;