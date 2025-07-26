import { Request, Response } from 'express';
import { InInstantwinConversationService } from '../../services/in_instantwin_conversation_service';
import { ConversationValidator } from './utils/conversation_validator';
import { CONVERSATION_CONSTANTS } from './utils/conversation_constants';
import { ResponseHelper } from '../response_helper';
import { ConversationDetailResponse } from './types/conversation_response';

export const putEndConversationApi = async (req: Request, res: Response): Promise<void> => {
  try {
    const { isValid, numericId, error } = ConversationValidator.validateId(req.params.id);
    
    if (!isValid || !numericId) {
      ResponseHelper.badRequest(res, error || '無効なIDです');
      return;
    }

    const { status } = req.body;
    const endStatus = status !== undefined ? status : CONVERSATION_CONSTANTS.CONVERSATION_STATUS.COMPLETED;

    // Validate status if provided
    if (status !== undefined && !Object.values(CONVERSATION_CONSTANTS.CONVERSATION_STATUS).includes(status)) {
      ResponseHelper.badRequest(res, '無効なステータスです');
      return;
    }

    const conversation = await InInstantwinConversationService.endConversation(numericId, endStatus);
    
    if (!conversation) {
      ResponseHelper.notFound(res, '会話が見つかりません');
      return;
    }

    const response: ConversationDetailResponse = {
      in_instantwin_conversation: {
        id: conversation.id,
        template_id: conversation.template_id,
        user_id: conversation.user_id,
        status: conversation.status,
        current_node_id: conversation.current_node_id,
        metadata: conversation.metadata,
        started_at: conversation.started_at,
        ended_at: conversation.ended_at,
        created: conversation.created,
        modified: conversation.modified,
      },
    };

    ResponseHelper.success(res, response, CONVERSATION_CONSTANTS.MESSAGES.CONVERSATION_ENDED);
  } catch (error) {
    console.error('Error in putEndConversationApi:', error);
    
    if (error instanceof Error) {
      if (error.message.startsWith(CONVERSATION_CONSTANTS.ERROR_CODES.CONVERSATION_ALREADY_ENDED)) {
        ResponseHelper.badRequest(res, '会話は既に終了されています');
      } else {
        ResponseHelper.internalServerError(res, '会話の終了に失敗しました');
      }
    } else {
      ResponseHelper.internalServerError(res, '会話の終了に失敗しました');
    }
  }
};