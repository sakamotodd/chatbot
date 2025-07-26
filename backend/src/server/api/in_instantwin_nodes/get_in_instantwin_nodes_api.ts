import { Request, Response, NextFunction } from 'express';
import { InInstantwinNodeService } from '../../services/in_instantwin_node_service';
import { ResponseHelper } from '../../utils/response';
import { NodeValidator } from './utils/node_validator';
import { NODE_CONSTANTS } from './utils/node_constants';
import { NodeQueryParams } from './types/node_request';

export const getInInstantwinNodes = async (
  req: Request<
    Record<string, never>,
    Record<string, never>,
    Record<string, never>,
    NodeQueryParams
  >,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { page, limit, filters } = NodeValidator.validateQueryParams(req.query);

    const result = await InInstantwinNodeService.getAllNodes({
      page,
      limit,
      template_id: filters.template_id,
      prize_id: filters.prize_id,
      type: filters.type,
    });

    const responseData = {
      in_instantwin_nodes: result.nodes.map(node => ({
        id: node.id,
        template_id: node.template_id,
        prize_id: node.prize_id,
        type: node.type,
        created: node.created,
        modified: node.modified,
      })),
      pagination: result.pagination,
    };

    ResponseHelper.success(res, responseData, NODE_CONSTANTS.MESSAGES.NODES_RETRIEVED);
  } catch (error: any) {
    next(error);
  }
};

export default getInInstantwinNodes;