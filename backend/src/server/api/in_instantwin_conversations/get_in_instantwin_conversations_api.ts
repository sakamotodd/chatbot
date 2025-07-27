import { Request, Response } from 'express';
import { InInstantwinConversationService } from '../../services/in_instantwin_conversation_service';
import { ConversationValidator } from './utils/conversation_validator';
import { CONVERSATION_CONSTANTS } from './utils/conversation_constants';
import { ResponseHelper } from '../../utils/response';
import { ConversationListResponse } from './types/conversation_response';

export const getInInstantwinConversationsApi = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page, limit, filters } = ConversationValidator.validateQueryParams(req.query);

    const { conversations, pagination } = await InInstantwinConversationService.getConversations(filters, page, limit);

    const response: ConversationListResponse = {
      in_instantwin_conversations: conversations.map(conversation => ({
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
      })),
      pagination,
    };

    ResponseHelper.success(res, response, CONVERSATION_CONSTANTS.MESSAGES.CONVERSATIONS_RETRIEVED);
  } catch (error) {
    console.error('Error in getInInstantwinConversationsApi:', error);
    
    if (error instanceof Error && error.message.startsWith(CONVERSATION_CONSTANTS.ERROR_CODES.VALIDATION_ERROR)) {
      ResponseHelper.badRequest(res, error.message);
    } else {
      ResponseHelper.internalError(res, '会話一覧の取得に失敗しました');
    }
  }
};