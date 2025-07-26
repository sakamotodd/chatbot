import { Router } from 'express';
import { getWebSocketInfoApi, getUserConnectionStatusApi, sendBroadcastMessageApi } from './websocket_info_api';

const router = Router();

// GET /api/websocket/info - Get WebSocket server information
router.get('/websocket/info', getWebSocketInfoApi);

// GET /api/websocket/user/:user_id/status - Get user connection status
router.get('/websocket/user/:user_id/status', getUserConnectionStatusApi);

// POST /api/websocket/broadcast - Send broadcast message
router.post('/websocket/broadcast', sendBroadcastMessageApi);

export default router;