import { Request, Response } from 'express';
import { LotteryEngineService } from '../../services/lottery_engine_service';
import { LotteryValidator } from './utils/lottery_validator';
import { LOTTERY_CONSTANTS } from './utils/lottery_constants';
import { ResponseHelper } from '../../utils/response';
import { LotteryValidationRequest } from './types/lottery_request';
import { LotteryValidationResponse } from './types/lottery_response';

export const postLotteryValidateApi = async (req: Request, res: Response): Promise<void> => {
  try {
    const validationData: LotteryValidationRequest = req.body;

    // Validate request data
    const validation = LotteryValidator.validateValidationRequest(validationData);
    if (!validation.isValid) {
      ResponseHelper.badRequest(res, `${LOTTERY_CONSTANTS.ERROR_CODES.VALIDATION_ERROR}: ${validation.errors.join(', ')}`);
      return;
    }

    // Check lottery eligibility
    const eligibility = await LotteryEngineService.validateLotteryEligibility(
      validationData.user_id,
      validationData.template_id
    );

    const response: LotteryValidationResponse = {
      lottery_validation: {
        eligible: eligibility.eligible,
        reason: eligibility.reason,
        user_id: validationData.user_id,
        template_id: validationData.template_id,
        checked_at: new Date(),
      },
    };

    ResponseHelper.success(res, response, LOTTERY_CONSTANTS.MESSAGES.LOTTERY_VALIDATION_COMPLETED);
  } catch (error) {
    console.error('Error in postLotteryValidateApi:', error);
    ResponseHelper.internalError(res, '抽選資格確認に失敗しました');
  }
};