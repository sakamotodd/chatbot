import { Request, Response } from 'express';
import { InInstantwinMessageService } from '../../services/in_instantwin_message_service';
import { MessageValidator } from './utils/message_validator';
import { MESSAGE_CONSTANTS } from './utils/message_constants';
import { ResponseHelper } from '../response_helper';
import { MessageListResponse } from './types/message_response';

export const getInInstantwinMessagesApi = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page, limit, filters } = MessageValidator.validateQueryParams(req.query);

    const { messages, pagination } = await InInstantwinMessageService.getMessages(filters, page, limit);

    const response: MessageListResponse = {
      in_instantwin_messages: messages.map(message => ({
        id: message.id,
        node_id: message.node_id,
        type: message.type,
        content: message.content,
        step_order: message.step_order,
        created: message.created,
        modified: message.modified,
      })),
      pagination,
    };

    ResponseHelper.success(res, response, MESSAGE_CONSTANTS.MESSAGES.MESSAGES_RETRIEVED);
  } catch (error) {
    console.error('Error in getInInstantwinMessagesApi:', error);
    
    if (error instanceof Error && error.message.startsWith(MESSAGE_CONSTANTS.ERROR_CODES.VALIDATION_ERROR)) {
      ResponseHelper.badRequest(res, error.message);
    } else {
      ResponseHelper.internalServerError(res, 'メッセージ一覧の取得に失敗しました');
    }
  }
};