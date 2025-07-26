import { Router } from 'express';
import {
  validate,
  commonSchemas,
} from '../../middleware/validation_middleware';
import {
  createCampaignSchema,
  updateCampaignSchema,
  campaignQuerySchema,
} from './types/campaign_request';

// Import API handlers
import getCampaigns from './get_campaigns_api';
import getCampaignById from './get_campaign_by_id_api';
import createCampaign from './post_campaign_api';
import updateCampaign from './put_campaign_api';
import deleteCampaign from './delete_campaign_api';

const router = Router();

// GET /api/campaigns - Get all campaigns with pagination and filtering
router.get('/', validate({ query: campaignQuerySchema }), getCampaigns);

// GET /api/campaigns/:id - Get campaign by ID
router.get('/:id', validate({ params: commonSchemas.id }), getCampaignById);

// POST /api/campaigns - Create new campaign
router.post('/', validate({ body: createCampaignSchema }), createCampaign);

// PUT /api/campaigns/:id - Update campaign
router.put(
  '/:id',
  validate({
    params: commonSchemas.id,
    body: updateCampaignSchema,
  }),
  updateCampaign
);

// DELETE /api/campaigns/:id - Delete campaign
router.delete('/:id', validate({ params: commonSchemas.id }), deleteCampaign);

export default router;
