import { Request, Response, NextFunction } from 'express';
import { InInstantwinPrizeService } from '../../services/in_instantwin_prize_service';
import { ResponseHelper } from '../../utils/response';
import { PrizeValidator } from './utils/prize_validator';
import { PRIZE_CONSTANTS } from './utils/prize_constants';
import { PrizeDeleteParams } from './types/prize_request';

export const deleteInInstantwinPrize = async (
  req: Request<
    { id: string },
    Record<string, never>,
    Record<string, never>,
    PrizeDeleteParams
  >,
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
    const force = req.query.force === 'true';

    // Delete prize
    const deleteResult = await InInstantwinPrizeService.deletePrize(prizeId, force);

    const responseData = {
      deleted_prize_id: prizeId,
      deleted_related_data: deleteResult,
    };

    ResponseHelper.success(res, responseData, PRIZE_CONSTANTS.MESSAGES.PRIZE_DELETED);
  } catch (error: any) {
    if (error.statusCode === 404) {
      ResponseHelper.notFound(res, error.message, error.code);
      return;
    }
    if (error.statusCode === 409) {
      ResponseHelper.conflict(res, error.message, {
        code: error.code,
        details: error.details,
      });
      return;
    }
    next(error);
  }
};

export default deleteInInstantwinPrize;