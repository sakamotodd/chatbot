import { Request, Response } from 'express';
import { InInstantwinMessageService } from '../../services/in_instantwin_message_service';
import { MessageValidator } from './utils/message_validator';
import { MESSAGE_CONSTANTS } from './utils/message_constants';
import { ResponseHelper } from '../../utils/response';
import { MessageResponse } from './types/message_response';

interface ReorderRequest {
  node_id: number;
  message_orders: { id: number; step_order: number }[];
}

export const putMessagesReorderApi = async (req: Request, res: Response): Promise<void> => {
  try {
    const { node_id, message_orders }: ReorderRequest = req.body;

    if (!node_id || node_id <= 0) {
      ResponseHelper.badRequest(res, 'ノードIDは必須です');
      return;
    }

    if (!Array.isArray(message_orders) || message_orders.length === 0) {
      ResponseHelper.badRequest(res, 'メッセージ順序配列は必須です');
      return;
    }

    // Validate message order entries
    for (const order of message_orders) {
      if (!order.id || order.id <= 0 || !Number.isInteger(order.id)) {
        ResponseHelper.badRequest(res, '無効なメッセージIDです');
        return;
      }
      if (order.step_order === undefined || order.step_order < 0 || !Number.isInteger(order.step_order)) {
        ResponseHelper.badRequest(res, '無効なステップ順序です');
        return;
      }
    }

    const messages = await InInstantwinMessageService.reorderMessages(node_id, message_orders);

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

    ResponseHelper.success(res, response, 'メッセージの順序が正常に更新されました');
  } catch (error) {
    console.error('Error in putMessagesReorderApi:', error);
    
    if (error instanceof Error) {
      if (error.message.startsWith(MESSAGE_CONSTANTS.ERROR_CODES.NODE_NOT_FOUND)) {
        ResponseHelper.notFound(res, 'ノードが見つかりません');
      } else if (error.message.startsWith(MESSAGE_CONSTANTS.ERROR_CODES.MESSAGE_NOT_FOUND)) {
        ResponseHelper.notFound(res, 'メッセージが見つかりません');
      } else {
        ResponseHelper.internalError(res, 'メッセージの順序更新に失敗しました');
      }
    } else {
      ResponseHelper.internalError(res, 'メッセージの順序更新に失敗しました');
    }
  }
};