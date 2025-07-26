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
      limit = 20,
      search,
      status,
      sortBy = 'created',
      sortOrder = 'desc',
    } = req.query;

    const result = await CampaignService.getAllCampaigns({
      page: Number(page),
      limit: Number(limit),
      search,
      status,
      sortBy,
      sortOrder,
    });

    ResponseHelper.paginated(
      res,
      result.campaigns,
      result.pagination.page,
      result.pagination.limit,
      result.pagination.total,
      'キャンペーン一覧を取得しました'
    );
  } catch (error) {
    next(error);
  }
};

export default getCampaigns;
