import { Router } from 'express';
import { postInInstantwinCardApi } from './post_in_instantwin_card_api';

const router = Router();

// POST /api/in_instantwin_cards - Create new card
router.post('/in_instantwin_cards', postInInstantwinCardApi);

export default router;