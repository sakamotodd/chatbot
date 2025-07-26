import { Request, Response, NextFunction } from 'express';
import { CampaignService } from '../../services/campaign_service';
import { ResponseHelper } from '../../utils/response';

export const getCampaignById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const campaignId = parseInt(id, 10);

    if (isNaN(campaignId)) {
      ResponseHelper.badRequest(res, '無効なキャンペーンIDです');
      return;
    }

    const campaign = await CampaignService.getCampaignById(campaignId);
    ResponseHelper.success(res, campaign, 'キャンペーン詳細を取得しました');
  } catch (error) {
    next(error);
  }
};

export default getCampaignById;
