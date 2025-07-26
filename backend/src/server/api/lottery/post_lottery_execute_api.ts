import { Request, Response } from 'express';
import { LotteryEngineService } from '../../services/lottery_engine_service';
import { LotteryValidator } from './utils/lottery_validator';
import { LOTTERY_CONSTANTS } from './utils/lottery_constants';
import { ResponseHelper } from '../response_helper';
import { LotteryExecuteRequest } from './types/lottery_request';
import { LotteryExecuteResponse } from './types/lottery_response';

export const postLotteryExecuteApi = async (req: Request, res: Response): Promise<void> => {
  try {
    const lotteryData: LotteryExecuteRequest = req.body;

    // Validate request data
    const validation = LotteryValidator.validateExecuteRequest(lotteryData);
    if (!validation.isValid) {
      ResponseHelper.badRequest(res, `${LOTTERY_CONSTANTS.ERROR_CODES.VALIDATION_ERROR}: ${validation.errors.join(', ')}`);
      return;
    }

    // Check lottery eligibility
    const templateId = lotteryData.template_id || 0; // Will be determined from conversation if not provided
    if (templateId > 0) {
      const eligibility = await LotteryEngineService.validateLotteryEligibility(lotteryData.user_id, templateId);
      if (!eligibility.eligible) {
        ResponseHelper.badRequest(res, `${LOTTERY_CONSTANTS.ERROR_CODES.LOTTERY_NOT_ELIGIBLE}: ${eligibility.reason}`);
        return;
      }
    }

    // Execute lottery
    const result = await LotteryEngineService.executeLottery({
      user_id: lotteryData.user_id,
      conversation_id: lotteryData.conversation_id,
      template_id: lotteryData.template_id,
      exclude_prize_ids: lotteryData.exclude_prize_ids,
      custom_weights: lotteryData.custom_weights,
    });

    const response: LotteryExecuteResponse = {
      lottery_result: {
        is_winner: result.is_winner,
        prize_id: result.prize_id,
        prize: result.prize,
        lottery_id: result.lottery_id,
        probability_used: result.probability_used,
        random_value: result.random_value,
        message: result.message,
        executed_at: new Date(),
      },
    };

    ResponseHelper.created(res, response, LOTTERY_CONSTANTS.MESSAGES.LOTTERY_EXECUTED);
  } catch (error) {
    console.error('Error in postLotteryExecuteApi:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('Conversation not found')) {
        ResponseHelper.notFound(res, '会話が見つかりません');
      } else if (error.message.includes('Template not found')) {
        ResponseHelper.notFound(res, 'テンプレートが見つかりません');
      } else if (error.message.includes('No prizes available')) {
        ResponseHelper.badRequest(res, '利用可能なプライズがありません');
      } else {
        ResponseHelper.internalServerError(res, '抽選の実行に失敗しました');
      }
    } else {
      ResponseHelper.internalServerError(res, '抽選の実行に失敗しました');
    }
  }
};