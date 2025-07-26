import { Router } from 'express';
import getInInstantwinTemplates from './get_in_instantwin_templates_api';
import getInInstantwinTemplateById from './get_in_instantwin_template_by_id_api';
import postInInstantwinTemplate from './post_in_instantwin_template_api';
import putInInstantwinTemplate from './put_in_instantwin_template_api';
import deleteInInstantwinTemplate from './delete_in_instantwin_template_api';

const router = Router();

// Prize-specific template routes (nested under prizes)
router.get('/in_instantwin_prizes/:prizeId/in_instantwin_templates', getInInstantwinTemplates);
router.post('/in_instantwin_prizes/:prizeId/in_instantwin_templates', postInInstantwinTemplate);

// Individual template routes
router.get('/in_instantwin_templates/:id', getInInstantwinTemplateById);
router.put('/in_instantwin_templates/:id', putInInstantwinTemplate);
router.delete('/in_instantwin_templates/:id', deleteInInstantwinTemplate);

export default router;