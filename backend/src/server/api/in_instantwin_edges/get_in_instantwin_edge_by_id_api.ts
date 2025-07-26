import { Request, Response } from 'express';
import { InInstantwinEdgeService } from '../../services/in_instantwin_edge_service';
import { EdgeValidator } from './utils/edge_validator';
import { EDGE_CONSTANTS } from './utils/edge_constants';
import { ResponseHelper } from '../response_helper';
import { EdgeDetailResponse } from './types/edge_response';

export const getInInstantwinEdgeByIdApi = async (req: Request, res: Response): Promise<void> => {
  try {
    const { isValid, numericId, error } = EdgeValidator.validateId(req.params.id);
    
    if (!isValid || !numericId) {
      ResponseHelper.badRequest(res, error || '無効なIDです');
      return;
    }

    const edge = await InInstantwinEdgeService.getEdgeById(numericId);
    
    if (!edge) {
      ResponseHelper.notFound(res, 'エッジが見つかりません');
      return;
    }

    const response: EdgeDetailResponse = {
      in_instantwin_edge: {
        id: edge.id,
        template_id: edge.template_id,
        prize_id: edge.prize_id,
        source_node_id: edge.source_node_id,
        target_node_id: edge.target_node_id,
        condition: edge.condition,
        created: edge.created,
        modified: edge.modified,
      },
    };

    ResponseHelper.success(res, response, EDGE_CONSTANTS.MESSAGES.EDGE_RETRIEVED);
  } catch (error) {
    console.error('Error in getInInstantwinEdgeByIdApi:', error);
    ResponseHelper.internalServerError(res, 'エッジの取得に失敗しました');
  }
};