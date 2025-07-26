import Joi from 'joi';

// Campaign creation request
export interface CreateCampaignRequest {
  title: string;
  description?: string;
  status?: string;
  start_date?: string;
  end_date?: string;
}

// Campaign update request
export interface UpdateCampaignRequest {
  title?: string;
  description?: string;
  status?: string;
  start_date?: string;
  end_date?: string;
}

// Campaign query parameters
export interface CampaignQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Validation schemas
export const createCampaignSchema = Joi.object({
  title: Joi.string().required().max(255).messages({
    'string.empty': 'タイトルは必須です',
    'string.max': 'タイトルは255文字以内で入力してください',
  }),
  description: Joi.string().allow('').optional(),
  status: Joi.string()
    .valid('draft', 'active', 'paused', 'completed', 'archived')
    .default('draft'),
  start_date: Joi.date().iso().optional(),
  end_date: Joi.date()
    .iso()
    .greater(Joi.ref('start_date'))
    .optional()
    .messages({
      'date.greater': '終了日は開始日より後の日付を設定してください',
    }),
});

export const updateCampaignSchema = Joi.object({
  title: Joi.string().max(255).optional().messages({
    'string.max': 'タイトルは255文字以内で入力してください',
  }),
  description: Joi.string().allow('').optional(),
  status: Joi.string()
    .valid('draft', 'active', 'paused', 'completed', 'archived')
    .optional(),
  start_date: Joi.date().iso().optional(),
  end_date: Joi.date().iso().optional(),
});

export const campaignQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
  search: Joi.string().allow('').optional(),
  status: Joi.string()
    .valid('draft', 'active', 'paused', 'completed', 'archived')
    .optional(),
  sortBy: Joi.string()
    .valid('id', 'title', 'status', 'created', 'modified')
    .default('created'),
  sortOrder: Joi.string().valid('asc', 'desc').default('desc'),
});
