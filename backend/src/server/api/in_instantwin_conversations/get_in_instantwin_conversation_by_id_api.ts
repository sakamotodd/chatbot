import { Request, Response } from 'express';
import { InInstantwinConversationService } from '../../services/in_instantwin_conversation_service';
import { ConversationValidator } from './utils/conversation_validator';
import { CONVERSATION_CONSTANTS } from './utils/conversation_constants';
import { ResponseHelper } from '../response_helper';
import { ConversationDetailResponse } from './types/conversation_response';

export const getInInstantwinConversationByIdApi = async (req: Request, res: Response): Promise<void> => {
  try {
    const { isValid, numericId, error } = ConversationValidator.validateId(req.params.id);
    
    if (!isValid || !numericId) {
      ResponseHelper.badRequest(res, error || '無効なIDです');
      return;
    }

    const conversation = await InInstantwinConversationService.getConversationById(numericId);
    
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

    ResponseHelper.success(res, response, CONVERSATION_CONSTANTS.MESSAGES.CONVERSATION_RETRIEVED);
  } catch (error) {
    console.error('Error in getInInstantwinConversationByIdApi:', error);
    ResponseHelper.internalServerError(res, '会話の取得に失敗しました');
  }
};