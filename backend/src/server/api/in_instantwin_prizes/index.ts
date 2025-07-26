import { Router } from 'express';
import getInInstantwinPrizes from './get_in_instantwin_prizes_api';
import getInInstantwinPrizeById from './get_in_instantwin_prize_by_id_api';
import getInInstantwinPrizeStatistics from './get_in_instantwin_prize_statistics_api';
import postInInstantwinPrize from './post_in_instantwin_prize_api';
import putInInstantwinPrize from './put_in_instantwin_prize_api';
import deleteInInstantwinPrize from './delete_in_instantwin_prize_api';

const router = Router();

// Campaign-specific prize routes (nested under campaigns)
router.get('/campaigns/:campaignId/in_instantwin_prizes', getInInstantwinPrizes);
router.post('/campaigns/:campaignId/in_instantwin_prizes', postInInstantwinPrize);

// Individual prize routes
router.get('/in_instantwin_prizes/:id', getInInstantwinPrizeById);
router.get('/in_instantwin_prizes/:id/statistics', getInInstantwinPrizeStatistics);
router.put('/in_instantwin_prizes/:id', putInInstantwinPrize);
router.delete('/in_instantwin_prizes/:id', deleteInInstantwinPrize);

export default router;