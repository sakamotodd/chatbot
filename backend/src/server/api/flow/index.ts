import { Router } from 'express';
import { postFlowValidationApi } from './post_flow_validation_api';
import { getFlowValidationApi } from './get_flow_validation_api';

const router = Router();

// POST /api/flow/validate - Validate flow by request body
router.post('/flow/validate', postFlowValidationApi);

// GET /api/flow/validate/:template_id - Validate flow by template ID
router.get('/flow/validate/:template_id', getFlowValidationApi);

export default router;