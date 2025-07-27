import { Request, Response } from 'express';
import { InInstantwinConversationService } from '../../services/in_instantwin_conversation_service';
import { CONVERSATION_CONSTANTS } from './utils/conversation_constants';
import { ResponseHelper } from '../../utils/response';
import { ConversationCreateRequest } from './types/conversation_request';
import { ConversationDetailResponse } from './types/conversation_response';

export const postInInstantwinConversationApi = async (req: Request, res: Response): Promise<void> => {
  try {
    const conversationData: ConversationCreateRequest = req.body;

    const conversation = await InInstantwinConversationService.createConversation(conversationData);

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

    ResponseHelper.created(res, response, CONVERSATION_CONSTANTS.MESSAGES.CONVERSATION_CREATED);
  } catch (error) {
    console.error('Error in postInInstantwinConversationApi:', error);
    
    if (error instanceof Error) {
      if (error.message.startsWith(CONVERSATION_CONSTANTS.ERROR_CODES.VALIDATION_ERROR)) {
        ResponseHelper.badRequest(res, error.message);
      } else if (error.message.startsWith(CONVERSATION_CONSTANTS.ERROR_CODES.TEMPLATE_NOT_FOUND)) {
        ResponseHelper.notFound(res, 'テンプレートが見つかりません');
      } else if (error.message.startsWith(CONVERSATION_CONSTANTS.ERROR_CODES.NODE_NOT_FOUND)) {
        ResponseHelper.notFound(res, 'ノードが見つかりません');
      } else {
        ResponseHelper.internalError(res, '会話の作成に失敗しました');
      }
    } else {
      ResponseHelper.internalError(res, '会話の作成に失敗しました');
    }
  }
};