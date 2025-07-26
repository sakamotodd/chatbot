import { Request, Response } from 'express';
import { InInstantwinEdgeService } from '../../services/in_instantwin_edge_service';
import { EdgeValidator } from './utils/edge_validator';
import { EDGE_CONSTANTS } from './utils/edge_constants';
import { ResponseHelper } from '../response_helper';
import { EdgeUpdateRequest } from './types/edge_request';
import { EdgeDetailResponse } from './types/edge_response';

export const putInInstantwinEdgeApi = async (req: Request, res: Response): Promise<void> => {
  try {
    const { isValid, numericId, error } = EdgeValidator.validateId(req.params.id);
    
    if (!isValid || !numericId) {
      ResponseHelper.badRequest(res, error || '無効なIDです');
      return;
    }

    const edgeData: EdgeUpdateRequest = req.body;

    const edge = await InInstantwinEdgeService.updateEdge(numericId, edgeData);
    
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

    ResponseHelper.success(res, response, EDGE_CONSTANTS.MESSAGES.EDGE_UPDATED);
  } catch (error) {
    console.error('Error in putInInstantwinEdgeApi:', error);
    
    if (error instanceof Error) {
      if (error.message.startsWith(EDGE_CONSTANTS.ERROR_CODES.VALIDATION_ERROR)) {
        ResponseHelper.badRequest(res, error.message);
      } else if (error.message.startsWith(EDGE_CONSTANTS.ERROR_CODES.NODE_NOT_FOUND)) {
        ResponseHelper.notFound(res, 'ノードが見つかりません');
      } else if (error.message.startsWith(EDGE_CONSTANTS.ERROR_CODES.TEMPLATE_NOT_FOUND)) {
        ResponseHelper.notFound(res, 'テンプレートが見つかりません');
      } else if (error.message.startsWith(EDGE_CONSTANTS.ERROR_CODES.CIRCULAR_REFERENCE)) {
        ResponseHelper.badRequest(res, '循環参照が発生するため、このエッジは更新できません');
      } else {
        ResponseHelper.internalServerError(res, 'エッジの更新に失敗しました');
      }
    } else {
      ResponseHelper.internalServerError(res, 'エッジの更新に失敗しました');
    }
  }
};