import { Router } from 'express';
import { getInInstantwinSelectOptionsApi } from './get_in_instantwin_select_options_api';
import { getInInstantwinSelectOptionByIdApi } from './get_in_instantwin_select_option_by_id_api';
import { postInInstantwinSelectOptionApi } from './post_in_instantwin_select_option_api';
import { putInInstantwinSelectOptionApi } from './put_in_instantwin_select_option_api';
import { deleteInInstantwinSelectOptionApi } from './delete_in_instantwin_select_option_api';
import { getSelectOptionsByMessageApi } from './get_select_options_by_message_api';
import { putSelectOptionsReorderApi } from './put_select_options_reorder_api';

const router = Router();

// GET /api/in_instantwin_select_options - Get all select options
router.get('/in_instantwin_select_options', getInInstantwinSelectOptionsApi);

// GET /api/in_instantwin_select_options/:id - Get select option by ID
router.get('/in_instantwin_select_options/:id', getInInstantwinSelectOptionByIdApi);

// POST /api/in_instantwin_select_options - Create new select option
router.post('/in_instantwin_select_options', postInInstantwinSelectOptionApi);

// PUT /api/in_instantwin_select_options/:id - Update select option
router.put('/in_instantwin_select_options/:id', putInInstantwinSelectOptionApi);

// DELETE /api/in_instantwin_select_options/:id - Delete select option
router.delete('/in_instantwin_select_options/:id', deleteInInstantwinSelectOptionApi);

// GET /api/in_instantwin_select_options/message/:message_id - Get select options by message ID
router.get('/in_instantwin_select_options/message/:message_id', getSelectOptionsByMessageApi);

// PUT /api/in_instantwin_select_options/reorder - Reorder select options for a message
router.put('/in_instantwin_select_options/reorder', putSelectOptionsReorderApi);

export default router;