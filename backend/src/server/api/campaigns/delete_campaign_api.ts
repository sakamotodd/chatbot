import { Request, Response, NextFunction } from 'express';
import { CampaignService } from '../../services/campaign_service';
import { ResponseHelper } from '../../utils/response';

export const deleteCampaign = async (
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

    await CampaignService.deleteCampaign(campaignId);
    ResponseHelper.deleted(res, 'キャンペーンが正常に削除されました');
  } catch (error) {
    next(error);
  }
};

export default deleteCampaign;
