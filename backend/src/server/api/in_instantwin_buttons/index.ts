import { Router } from 'express';
import { postInInstantwinButtonApi } from './post_in_instantwin_button_api';

const router = Router();

// POST /api/in_instantwin_buttons - Create new button
router.post('/in_instantwin_buttons', postInInstantwinButtonApi);

export default router;