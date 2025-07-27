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
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_PARAMETER',
          message: '無効なキャンペーンIDです',
          details: {
            field: 'id',
            value: id,
            expected: 'number',
          },
        },
      });
    }

    const campaign = await CampaignService.getCampaignById(campaignId);
    
    res.status(200).json({
      success: true,
      data: {
        campaign,
      },
    });
  } catch (error) {
    if ((error as any).statusCode === 404) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'CAMPAIGN_NOT_FOUND',
          message: '指定されたキャンペーンが見つかりません',
          details: {
            campaign_id: campaignId,
          },
        },
      });
    }
    next(error);
  }
};

export default getCampaignById;
