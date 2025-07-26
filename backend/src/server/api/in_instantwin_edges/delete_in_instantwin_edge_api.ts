import { Request, Response } from 'express';
import { InInstantwinEdgeService } from '../../services/in_instantwin_edge_service';
import { EdgeValidator } from './utils/edge_validator';
import { EDGE_CONSTANTS } from './utils/edge_constants';
import { ResponseHelper } from '../response_helper';

export const deleteInInstantwinEdgeApi = async (req: Request, res: Response): Promise<void> => {
  try {
    const { isValid, numericId, error } = EdgeValidator.validateId(req.params.id);
    
    if (!isValid || !numericId) {
      ResponseHelper.badRequest(res, error || '無効なIDです');
      return;
    }

    const deleted = await InInstantwinEdgeService.deleteEdge(numericId);
    
    if (!deleted) {
      ResponseHelper.notFound(res, 'エッジが見つかりません');
      return;
    }

    ResponseHelper.success(res, null, EDGE_CONSTANTS.MESSAGES.EDGE_DELETED);
  } catch (error) {
    console.error('Error in deleteInInstantwinEdgeApi:', error);
    ResponseHelper.internalServerError(res, 'エッジの削除に失敗しました');
  }
};