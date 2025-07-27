import { Request, Response } from 'express';
import { InInstantwinMessageService } from '../../services/in_instantwin_message_service';
import { MessageValidator } from './utils/message_validator';
import { MESSAGE_CONSTANTS } from './utils/message_constants';
import { ResponseHelper } from '../../utils/response';
import { MessageResponse } from './types/message_response';

export const getMessagesByNodeApi = async (req: Request, res: Response): Promise<void> => {
  try {
    const { isValid, numericId, error } = MessageValidator.validateId(req.params.node_id);
    
    if (!isValid || !numericId) {
      ResponseHelper.badRequest(res, error || '無効なノードIDです');
      return;
    }

    const messages = await InInstantwinMessageService.getMessagesByNodeId(numericId);

    const response: { messages: MessageResponse[] } = {
      messages: messages.map(message => ({
        id: message.id,
        node_id: message.node_id,
        type: message.type,
        content: message.content,
        step_order: message.step_order,
        created: message.created,
        modified: message.modified,
      })),
    };

    ResponseHelper.success(res, response, MESSAGE_CONSTANTS.MESSAGES.MESSAGES_RETRIEVED);
  } catch (error) {
    console.error('Error in getMessagesByNodeApi:', error);
    ResponseHelper.internalError(res, 'ノードのメッセージ取得に失敗しました');
  }
};