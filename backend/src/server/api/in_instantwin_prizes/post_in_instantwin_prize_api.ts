import { Request, Response, NextFunction } from 'express';
import { InInstantwinPrizeService } from '../../services/in_instantwin_prize_service';
import { ResponseHelper } from '../../utils/response';
import { PrizeValidator } from './utils/prize_validator';
import { PRIZE_CONSTANTS } from './utils/prize_constants';
import { PrizeCreateRequest } from './types/prize_request';

export const postInInstantwinPrize = async (
  req: Request<
    { campaignId: string },
    Record<string, never>,
    PrizeCreateRequest,
    Record<string, never>
  >,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const campaignIdValidation = PrizeValidator.validateId(req.params.campaignId);
    if (!campaignIdValidation.isValid) {
      ResponseHelper.badRequest(res, campaignIdValidation.error || '無効なキャンペーンIDです');
      return;
    }

    const campaignId = campaignIdValidation.numericId!;

    // Validate request body
    const validation = PrizeValidator.validateCreateRequest(req.body);
    if (!validation.isValid) {
      ResponseHelper.badRequest(res, '入力値に不正があります', {
        code: PRIZE_CONSTANTS.ERROR_CODES.VALIDATION_ERROR,
        details: validation.errors.map(error => ({ message: error })),
      });
      return;
    }

    // Create prize
    const prize = await InInstantwinPrizeService.createPrize(campaignId, req.body);

    ResponseHelper.created(res, true, PRIZE_CONSTANTS.MESSAGES.PRIZE_CREATED);
  } catch (error: any) {
    if (error.statusCode === 404) {
      ResponseHelper.notFound(res, error.message, error.code);
      return;
    }
    next(error);
  }
};

export default postInInstantwinPrize;