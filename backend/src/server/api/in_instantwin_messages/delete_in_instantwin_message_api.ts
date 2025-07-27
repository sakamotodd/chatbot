import { Request, Response } from 'express';
import { InInstantwinMessageService } from '../../services/in_instantwin_message_service';
import { MessageValidator } from './utils/message_validator';
import { MESSAGE_CONSTANTS } from './utils/message_constants';
import { ResponseHelper } from '../../utils/response';

export const deleteInInstantwinMessageApi = async (req: Request, res: Response): Promise<void> => {
  try {
    const { isValid, numericId, error } = MessageValidator.validateId(req.params.id);
    
    if (!isValid || !numericId) {
      ResponseHelper.badRequest(res, error || '無効なIDです');
      return;
    }

    const deleted = await InInstantwinMessageService.deleteMessage(numericId);
    
    if (!deleted) {
      ResponseHelper.notFound(res, 'メッセージが見つかりません');
      return;
    }

    ResponseHelper.success(res, null, MESSAGE_CONSTANTS.MESSAGES.MESSAGE_DELETED);
  } catch (error) {
    console.error('Error in deleteInInstantwinMessageApi:', error);
    ResponseHelper.internalError(res, 'メッセージの削除に失敗しました');
  }
};