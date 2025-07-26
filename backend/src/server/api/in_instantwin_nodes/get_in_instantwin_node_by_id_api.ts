import { Request, Response, NextFunction } from 'express';
import { InInstantwinNodeService } from '../../services/in_instantwin_node_service';
import { ResponseHelper } from '../../utils/response';
import { NodeValidator } from './utils/node_validator';
import { NODE_CONSTANTS } from './utils/node_constants';

export const getInInstantwinNodeById = async (
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
    const node = await InInstantwinNodeService.getNodeById(nodeId);

    const nodeData = {
      id: node.id,
      template_id: node.template_id,
      prize_id: node.prize_id,
      type: node.type,
      created: node.created,
      modified: node.modified,
    };

    const responseData = {
      in_instantwin_node: nodeData,
    };

    ResponseHelper.success(res, responseData, NODE_CONSTANTS.MESSAGES.NODE_RETRIEVED);
  } catch (error: any) {
    if (error.statusCode === 404) {
      ResponseHelper.notFound(res, error.message, error.code);
      return;
    }
    next(error);
  }
};

export default getInInstantwinNodeById;