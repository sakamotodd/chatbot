import { Router } from 'express';
import { getInInstantwinConversationsApi } from './get_in_instantwin_conversations_api';
import { getInInstantwinConversationByIdApi } from './get_in_instantwin_conversation_by_id_api';
import { postInInstantwinConversationApi } from './post_in_instantwin_conversation_api';
import { putInInstantwinConversationApi } from './put_in_instantwin_conversation_api';
import { putEndConversationApi } from './put_end_conversation_api';
import { getConversationHistoryApi } from './get_conversation_history_api';
import { getActiveConversationApi } from './get_active_conversation_api';

const router = Router();

// GET /api/in_instantwin_conversations - Get all conversations
router.get('/in_instantwin_conversations', getInInstantwinConversationsApi);

// GET /api/in_instantwin_conversations/:id - Get conversation by ID
router.get('/in_instantwin_conversations/:id', getInInstantwinConversationByIdApi);

// POST /api/in_instantwin_conversations - Create new conversation
router.post('/in_instantwin_conversations', postInInstantwinConversationApi);

// PUT /api/in_instantwin_conversations/:id - Update conversation
router.put('/in_instantwin_conversations/:id', putInInstantwinConversationApi);

// PUT /api/in_instantwin_conversations/:id/end - End conversation
router.put('/in_instantwin_conversations/:id/end', putEndConversationApi);

// GET /api/in_instantwin_conversations/history/:user_id - Get conversation history by user
router.get('/in_instantwin_conversations/history/:user_id', getConversationHistoryApi);

// GET /api/in_instantwin_conversations/active/:user_id - Get active conversation by user
router.get('/in_instantwin_conversations/active/:user_id', getActiveConversationApi);

export default router;