import { Request, Response } from 'express';
import { InInstantwinConversationService } from '../../services/in_instantwin_conversation_service';
import { CONVERSATION_CONSTANTS } from './utils/conversation_constants';
import { ResponseHelper } from '../response_helper';
import { ConversationDetailResponse } from './types/conversation_response';

export const getActiveConversationApi = async (req: Request, res: Response): Promise<void> => {
  try {
    const { user_id } = req.params;
    const { template_id } = req.query;

    if (!user_id || user_id.trim().length === 0) {
      ResponseHelper.badRequest(res, 'ユーザーIDは必須です');
      return;
    }

    if (user_id.length > CONVERSATION_CONSTANTS.MAX_USER_ID_LENGTH) {
      ResponseHelper.badRequest(res, `ユーザーIDは${CONVERSATION_CONSTANTS.MAX_USER_ID_LENGTH}文字以内で入力してください`);
      return;
    }

    let templateIdNum: number | undefined;
    if (template_id) {
      templateIdNum = parseInt(template_id as string, 10);
      if (isNaN(templateIdNum) || templateIdNum <= 0) {
        ResponseHelper.badRequest(res, '無効なテンプレートIDです');
        return;
      }
    }

    const conversation = await InInstantwinConversationService.getActiveConversationByUser(user_id, templateIdNum);

    if (!conversation) {
      ResponseHelper.notFound(res, 'アクティブな会話が見つかりません');
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

    ResponseHelper.success(res, response, 'アクティブな会話を取得しました');
  } catch (error) {
    console.error('Error in getActiveConversationApi:', error);
    ResponseHelper.internalServerError(res, 'アクティブな会話の取得に失敗しました');
  }
};