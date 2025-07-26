import { Router } from 'express';
import { getInInstantwinMessagesApi } from './get_in_instantwin_messages_api';
import { getInInstantwinMessageByIdApi } from './get_in_instantwin_message_by_id_api';
import { postInInstantwinMessageApi } from './post_in_instantwin_message_api';
import { putInInstantwinMessageApi } from './put_in_instantwin_message_api';
import { deleteInInstantwinMessageApi } from './delete_in_instantwin_message_api';
import { getMessagesByNodeApi } from './get_messages_by_node_api';
import { putMessagesReorderApi } from './put_messages_reorder_api';

const router = Router();

// GET /api/in_instantwin_messages - Get all messages
router.get('/in_instantwin_messages', getInInstantwinMessagesApi);

// GET /api/in_instantwin_messages/:id - Get message by ID
router.get('/in_instantwin_messages/:id', getInInstantwinMessageByIdApi);

// POST /api/in_instantwin_messages - Create new message
router.post('/in_instantwin_messages', postInInstantwinMessageApi);

// PUT /api/in_instantwin_messages/:id - Update message
router.put('/in_instantwin_messages/:id', putInInstantwinMessageApi);

// DELETE /api/in_instantwin_messages/:id - Delete message
router.delete('/in_instantwin_messages/:id', deleteInInstantwinMessageApi);

// GET /api/in_instantwin_messages/node/:node_id - Get messages by node ID
router.get('/in_instantwin_messages/node/:node_id', getMessagesByNodeApi);

// PUT /api/in_instantwin_messages/reorder - Reorder messages for a node
router.put('/in_instantwin_messages/reorder', putMessagesReorderApi);

export default router;