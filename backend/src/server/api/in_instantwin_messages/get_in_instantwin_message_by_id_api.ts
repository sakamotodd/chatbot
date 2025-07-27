import { Request, Response } from 'express';
import { InInstantwinMessageService } from '../../services/in_instantwin_message_service';
import { MessageValidator } from './utils/message_validator';
import { MESSAGE_CONSTANTS } from './utils/message_constants';
import { ResponseHelper } from '../../utils/response';
import { MessageDetailResponse } from './types/message_response';

export const getInInstantwinMessageByIdApi = async (req: Request, res: Response): Promise<void> => {
  try {
    const { isValid, numericId, error } = MessageValidator.validateId(req.params.id);
    
    if (!isValid || !numericId) {
      ResponseHelper.badRequest(res, error || '無効なIDです');
      return;
    }

    const message = await InInstantwinMessageService.getMessageById(numericId);
    
    if (!message) {
      ResponseHelper.notFound(res, 'メッセージが見つかりません');
      return;
    }

    const response: MessageDetailResponse = {
      in_instantwin_message: {
        id: message.id,
        node_id: message.node_id,
        type: message.type,
        content: message.content,
        step_order: message.step_order,
        created: message.created,
        modified: message.modified,
      },
    };

    ResponseHelper.success(res, response, MESSAGE_CONSTANTS.MESSAGES.MESSAGE_RETRIEVED);
  } catch (error) {
    console.error('Error in getInInstantwinMessageByIdApi:', error);
    ResponseHelper.internalError(res, 'メッセージの取得に失敗しました');
  }
};