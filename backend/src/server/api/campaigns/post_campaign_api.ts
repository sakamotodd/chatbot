import { Request, Response, NextFunction } from 'express';
import { CampaignService } from '../../services/campaign_service';
import { ResponseHelper } from '../../utils/response';
import { CreateCampaignRequest } from './types/campaign_request';

export const createCampaign = async (
  req: Request<
    Record<string, never>,
    Record<string, never>,
    CreateCampaignRequest
  >,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const campaignData = req.body;

    // Convert date strings to Date objects if provided
    const processedData = {
      title: campaignData.title,
      description: campaignData.description,
      status: campaignData.status || 'draft',
      start_date: campaignData.start_date
        ? new Date(campaignData.start_date)
        : undefined,
      end_date: campaignData.end_date
        ? new Date(campaignData.end_date)
        : undefined,
    };

    const campaign = await CampaignService.createCampaign(processedData);
    ResponseHelper.created(res, campaign, 'キャンペーンが正常に作成されました');
  } catch (error) {
    next(error);
  }
};

export default createCampaign;
