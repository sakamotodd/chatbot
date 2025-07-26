import { Request, Response } from 'express';
import { InInstantwinMessageService } from '../../services/in_instantwin_message_service';
import { MESSAGE_CONSTANTS } from './utils/message_constants';
import { ResponseHelper } from '../response_helper';
import { MessageCreateRequest } from './types/message_request';
import { MessageDetailResponse } from './types/message_response';

export const postInInstantwinMessageApi = async (req: Request, res: Response): Promise<void> => {
  try {
    const messageData: MessageCreateRequest = req.body;

    const message = await InInstantwinMessageService.createMessage(messageData);

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

    ResponseHelper.created(res, response, MESSAGE_CONSTANTS.MESSAGES.MESSAGE_CREATED);
  } catch (error) {
    console.error('Error in postInInstantwinMessageApi:', error);
    
    if (error instanceof Error) {
      if (error.message.startsWith(MESSAGE_CONSTANTS.ERROR_CODES.VALIDATION_ERROR)) {
        ResponseHelper.badRequest(res, error.message);
      } else if (error.message.startsWith(MESSAGE_CONSTANTS.ERROR_CODES.NODE_NOT_FOUND)) {
        ResponseHelper.notFound(res, 'ノードが見つかりません');
      } else if (error.message.startsWith(MESSAGE_CONSTANTS.ERROR_CODES.DUPLICATE_STEP_ORDER)) {
        ResponseHelper.badRequest(res, 'このステップ順序は既に使用されています');
      } else {
        ResponseHelper.internalServerError(res, 'メッセージの作成に失敗しました');
      }
    } else {
      ResponseHelper.internalServerError(res, 'メッセージの作成に失敗しました');
    }
  }
};