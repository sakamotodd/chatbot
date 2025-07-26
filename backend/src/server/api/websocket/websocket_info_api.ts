import { Request, Response } from 'express';
import { WebSocketService } from '../../services/websocket_service';
import { ResponseHelper } from '../response_helper';

export const getWebSocketInfoApi = async (req: Request, res: Response): Promise<void> => {
  try {
    const connectedUsers = WebSocketService.getConnectedUsers();
    const totalConnections = connectedUsers.length;

    const response = {
      websocket_info: {
        total_connected_users: totalConnections,
        connected_users: connectedUsers,
        server_time: new Date().toISOString(),
      },
    };

    ResponseHelper.success(res, response, 'WebSocket情報を取得しました');
  } catch (error) {
    console.error('Error in getWebSocketInfoApi:', error);
    ResponseHelper.internalServerError(res, 'WebSocket情報の取得に失敗しました');
  }
};

export const getUserConnectionStatusApi = async (req: Request, res: Response): Promise<void> => {
  try {
    const { user_id } = req.params;

    if (!user_id || user_id.trim().length === 0) {
      ResponseHelper.badRequest(res, 'ユーザーIDは必須です');
      return;
    }

    const isConnected = WebSocketService.isUserConnected(user_id);
    const connectionCount = WebSocketService.getUserConnectionCount(user_id);

    const response = {
      user_connection_status: {
        user_id,
        is_connected: isConnected,
        connection_count: connectionCount,
      },
    };

    ResponseHelper.success(res, response, 'ユーザー接続状態を取得しました');
  } catch (error) {
    console.error('Error in getUserConnectionStatusApi:', error);
    ResponseHelper.internalServerError(res, 'ユーザー接続状態の取得に失敗しました');
  }
};

export const sendBroadcastMessageApi = async (req: Request, res: Response): Promise<void> => {
  try {
    const { conversation_id, user_id, message, event_type } = req.body;

    if (!conversation_id && !user_id) {
      ResponseHelper.badRequest(res, '会話IDまたはユーザーIDが必要です');
      return;
    }

    if (!message) {
      ResponseHelper.badRequest(res, 'メッセージは必須です');
      return;
    }

    const eventType = event_type || 'broadcast-message';

    if (conversation_id) {
      WebSocketService.broadcastToConversation(conversation_id, eventType, {
        message,
        timestamp: new Date(),
        from: 'system',
      });
    }

    if (user_id) {
      WebSocketService.broadcastToUser(user_id, eventType, {
        message,
        timestamp: new Date(),
        from: 'system',
      });
    }

    ResponseHelper.success(res, null, 'メッセージが正常に送信されました');
  } catch (error) {
    console.error('Error in sendBroadcastMessageApi:', error);
    ResponseHelper.internalServerError(res, 'メッセージの送信に失敗しました');
  }
};