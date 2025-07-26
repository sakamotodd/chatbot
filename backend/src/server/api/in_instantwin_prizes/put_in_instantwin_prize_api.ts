import { Request, Response, NextFunction } from 'express';
import { InInstantwinPrizeService } from '../../services/in_instantwin_prize_service';
import { ResponseHelper } from '../../utils/response';
import { PrizeValidator } from './utils/prize_validator';
import { PRIZE_CONSTANTS } from './utils/prize_constants';
import { PrizeUpdateRequest } from './types/prize_request';

export const putInInstantwinPrize = async (
  req: Request<
    { id: string },
    Record<string, never>,
    PrizeUpdateRequest,
    Record<string, never>
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

    // Get current prize for validation
    let currentPrize;
    try {
      currentPrize = await InInstantwinPrizeService.getPrizeById(prizeId, {
        include_templates: false,
        include_nodes: false,
        include_messages: false,
      });
    } catch (error: any) {
      if (error.statusCode === 404) {
        ResponseHelper.notFound(res, error.message, error.code);
        return;
      }
      throw error;
    }

    // Validate request body
    const validation = PrizeValidator.validateUpdateRequest(req.body, currentPrize.send_winner_count);
    if (!validation.isValid) {
      ResponseHelper.badRequest(res, '入力値に不正があります', {
        code: PRIZE_CONSTANTS.ERROR_CODES.VALIDATION_ERROR,
        details: validation.errors.map(error => ({ message: error })),
      });
      return;
    }

    // Update prize
    const updatedPrize = await InInstantwinPrizeService.updatePrize(prizeId, req.body);

    ResponseHelper.success(res, true, PRIZE_CONSTANTS.MESSAGES.PRIZE_UPDATED);
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

export default putInInstantwinPrize;