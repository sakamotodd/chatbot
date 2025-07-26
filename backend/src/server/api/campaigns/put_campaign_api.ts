import { Request, Response, NextFunction } from 'express';
import { CampaignService } from '../../services/campaign_service';
import { ResponseHelper } from '../../utils/response';

export const updateCampaign = async (
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

    const updateData = req.body;

    // Convert date strings to Date objects if provided
    const processedData = {
      ...updateData,
      start_date: updateData.start_date
        ? new Date(updateData.start_date)
        : undefined,
      end_date: updateData.end_date ? new Date(updateData.end_date) : undefined,
    };

    const campaign = await CampaignService.updateCampaign(
      campaignId,
      processedData
    );
    ResponseHelper.updated(res, campaign, 'キャンペーンが正常に更新されました');
  } catch (error) {
    next(error);
  }
};

export default updateCampaign;
