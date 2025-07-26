import { Request, Response } from 'express';
import { InInstantwinConversationService } from '../../services/in_instantwin_conversation_service';
import { ConversationValidator } from './utils/conversation_validator';
import { CONVERSATION_CONSTANTS } from './utils/conversation_constants';
import { ResponseHelper } from '../response_helper';
import { ConversationResponse } from './types/conversation_response';

export const getConversationHistoryApi = async (req: Request, res: Response): Promise<void> => {
  try {
    const { user_id } = req.params;

    if (!user_id || user_id.trim().length === 0) {
      ResponseHelper.badRequest(res, 'ユーザーIDは必須です');
      return;
    }

    if (user_id.length > CONVERSATION_CONSTANTS.MAX_USER_ID_LENGTH) {
      ResponseHelper.badRequest(res, `ユーザーIDは${CONVERSATION_CONSTANTS.MAX_USER_ID_LENGTH}文字以内で入力してください`);
      return;
    }

    const conversations = await InInstantwinConversationService.getConversationsByUserId(user_id);

    const response: { conversations: ConversationResponse[] } = {
      conversations: conversations.map(conversation => ({
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
    };

    ResponseHelper.success(res, response, 'ユーザーの会話履歴を取得しました');
  } catch (error) {
    console.error('Error in getConversationHistoryApi:', error);
    ResponseHelper.internalServerError(res, '会話履歴の取得に失敗しました');
  }
};