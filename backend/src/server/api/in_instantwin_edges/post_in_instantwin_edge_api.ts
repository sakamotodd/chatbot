import { Request, Response } from 'express';
import { InInstantwinEdgeService } from '../../services/in_instantwin_edge_service';
import { EDGE_CONSTANTS } from './utils/edge_constants';
import { ResponseHelper } from '../response_helper';
import { EdgeCreateRequest } from './types/edge_request';
import { EdgeDetailResponse } from './types/edge_response';

export const postInInstantwinEdgeApi = async (req: Request, res: Response): Promise<void> => {
  try {
    const edgeData: EdgeCreateRequest = req.body;

    const edge = await InInstantwinEdgeService.createEdge(edgeData);

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

    ResponseHelper.created(res, response, EDGE_CONSTANTS.MESSAGES.EDGE_CREATED);
  } catch (error) {
    console.error('Error in postInInstantwinEdgeApi:', error);
    
    if (error instanceof Error) {
      if (error.message.startsWith(EDGE_CONSTANTS.ERROR_CODES.VALIDATION_ERROR)) {
        ResponseHelper.badRequest(res, error.message);
      } else if (error.message.startsWith(EDGE_CONSTANTS.ERROR_CODES.NODE_NOT_FOUND)) {
        ResponseHelper.notFound(res, 'ノードが見つかりません');
      } else if (error.message.startsWith(EDGE_CONSTANTS.ERROR_CODES.TEMPLATE_NOT_FOUND)) {
        ResponseHelper.notFound(res, 'テンプレートが見つかりません');
      } else if (error.message.startsWith(EDGE_CONSTANTS.ERROR_CODES.PRIZE_NOT_FOUND)) {
        ResponseHelper.notFound(res, 'プライズが見つかりません');
      } else if (error.message.startsWith(EDGE_CONSTANTS.ERROR_CODES.CIRCULAR_REFERENCE)) {
        ResponseHelper.badRequest(res, '循環参照が発生するため、このエッジは作成できません');
      } else {
        ResponseHelper.internalServerError(res, 'エッジの作成に失敗しました');
      }
    } else {
      ResponseHelper.internalServerError(res, 'エッジの作成に失敗しました');
    }
  }
};