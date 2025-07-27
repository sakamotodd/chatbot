import { Request, Response } from 'express';
import { InInstantwinConversationService } from '../../services/in_instantwin_conversation_service';
import { ConversationValidator } from './utils/conversation_validator';
import { CONVERSATION_CONSTANTS } from './utils/conversation_constants';
import { ResponseHelper } from '../../utils/response';
import { ConversationUpdateRequest } from './types/conversation_request';
import { ConversationDetailResponse } from './types/conversation_response';

export const putInInstantwinConversationApi = async (req: Request, res: Response): Promise<void> => {
  try {
    const { isValid, numericId, error } = ConversationValidator.validateId(req.params.id);
    
    if (!isValid || !numericId) {
      ResponseHelper.badRequest(res, error || '無効なIDです');
      return;
    }

    const conversationData: ConversationUpdateRequest = req.body;

    const conversation = await InInstantwinConversationService.updateConversation(numericId, conversationData);
    
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

    ResponseHelper.success(res, response, CONVERSATION_CONSTANTS.MESSAGES.CONVERSATION_UPDATED);
  } catch (error) {
    console.error('Error in putInInstantwinConversationApi:', error);
    
    if (error instanceof Error) {
      if (error.message.startsWith(CONVERSATION_CONSTANTS.ERROR_CODES.VALIDATION_ERROR)) {
        ResponseHelper.badRequest(res, error.message);
      } else if (error.message.startsWith(CONVERSATION_CONSTANTS.ERROR_CODES.TEMPLATE_NOT_FOUND)) {
        ResponseHelper.notFound(res, 'テンプレートが見つかりません');
      } else if (error.message.startsWith(CONVERSATION_CONSTANTS.ERROR_CODES.NODE_NOT_FOUND)) {
        ResponseHelper.notFound(res, 'ノードが見つかりません');
      } else if (error.message.startsWith(CONVERSATION_CONSTANTS.ERROR_CODES.CONVERSATION_ALREADY_ENDED)) {
        ResponseHelper.badRequest(res, '終了済みの会話は変更できません');
      } else {
        ResponseHelper.internalError(res, '会話の更新に失敗しました');
      }
    } else {
      ResponseHelper.internalError(res, '会話の更新に失敗しました');
    }
  }
};