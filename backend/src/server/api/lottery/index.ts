import { Router } from 'express';
import { postLotteryExecuteApi } from './post_lottery_execute_api';
import { postLotteryValidateApi } from './post_lottery_validate_api';

const router = Router();

// POST /api/lottery/execute - Execute lottery
router.post('/lottery/execute', postLotteryExecuteApi);

// POST /api/lottery/validate - Validate lottery eligibility
router.post('/lottery/validate', postLotteryValidateApi);

export default router;