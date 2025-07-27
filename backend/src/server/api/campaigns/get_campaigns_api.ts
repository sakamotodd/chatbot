import { Request, Response, NextFunction } from 'express';
import { CampaignService } from '../../services/campaign_service';
import { ResponseHelper } from '../../utils/response';
import { CampaignQueryParams } from './types/campaign_request';

export const getCampaigns = async (
  req: Request<
    Record<string, never>,
    Record<string, never>,
    Record<string, never>,
    CampaignQueryParams
  >,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      sort = 'created_desc',
    } = req.query;

    const result = await CampaignService.getCampaigns({
      page: Number(page),
      limit: Number(limit),
      status,
      sort,
    });

    // ドキュメント仕様に合わせたレスポンス形式
    res.status(200).json({
      success: true,
      data: {
        campaigns: result.campaigns,
        pagination: {
          current_page: result.pagination.page,
          total_pages: result.pagination.totalPages,
          total_count: result.pagination.total,
          per_page: result.pagination.limit,
          has_next: result.pagination.page < result.pagination.totalPages,
          has_prev: result.pagination.page > 1,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export default getCampaigns;
