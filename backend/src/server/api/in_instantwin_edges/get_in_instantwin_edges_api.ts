import { Request, Response } from 'express';
import { InInstantwinEdgeService } from '../../services/in_instantwin_edge_service';
import { EdgeValidator } from './utils/edge_validator';
import { EDGE_CONSTANTS } from './utils/edge_constants';
import { ResponseHelper } from '../../utils/response';
import { EdgeListResponse } from './types/edge_response';

export const getInInstantwinEdgesApi = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page, limit, filters } = EdgeValidator.validateQueryParams(req.query);

    const { edges, pagination } = await InInstantwinEdgeService.getEdges(filters, page, limit);

    const response: EdgeListResponse = {
      in_instantwin_edges: edges.map(edge => ({
        id: edge.id,
        template_id: edge.template_id,
        prize_id: edge.prize_id,
        source_node_id: edge.source_node_id,
        target_node_id: edge.target_node_id,
        condition: edge.condition,
        created: edge.created,
        modified: edge.modified,
      })),
      pagination,
    };

    ResponseHelper.success(res, response, EDGE_CONSTANTS.MESSAGES.EDGES_RETRIEVED);
  } catch (error) {
    console.error('Error in getInInstantwinEdgesApi:', error);
    
    if (error instanceof Error && error.message.startsWith(EDGE_CONSTANTS.ERROR_CODES.VALIDATION_ERROR)) {
      ResponseHelper.badRequest(res, error.message);
    } else {
      ResponseHelper.internalError(res, 'エッジ一覧の取得に失敗しました');
    }
  }
};