import { Request, Response, NextFunction } from 'express';
import { InInstantwinPrizeService } from '../../services/in_instantwin_prize_service';
import { ResponseHelper } from '../../utils/response';
import { PrizeValidator } from './utils/prize_validator';
import { PRIZE_CONSTANTS } from './utils/prize_constants';

export const getInInstantwinPrizeStatistics = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const idValidation = PrizeValidator.validateId(req.params.id);
    if (!idValidation.isValid) {
      ResponseHelper.badRequest(res, idValidation.error || '無効なプライズIDです');
      return;
    }

    const prizeId = idValidation.numericId!;
    const statistics = await InInstantwinPrizeService.getPrizeStatistics(prizeId);

    ResponseHelper.success(res, statistics, PRIZE_CONSTANTS.MESSAGES.PRIZE_STATISTICS_RETRIEVED);
  } catch (error: any) {
    if (error.statusCode === 404) {
      ResponseHelper.notFound(res, error.message, error.code);
      return;
    }
    next(error);
  }
};

export default getInInstantwinPrizeStatistics;