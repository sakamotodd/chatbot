import { LotteryExecuteRequest, LotteryValidationRequest } from '../types/lottery_request';
import { LOTTERY_CONSTANTS } from './lottery_constants';

export class LotteryValidator {
  static validateExecuteRequest(data: LotteryExecuteRequest): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Required fields validation
    if (!data.user_id || data.user_id.trim().length === 0) {
      errors.push('ユーザーIDは必須です');
    } else if (data.user_id.length > LOTTERY_CONSTANTS.MAX_USER_ID_LENGTH) {
      errors.push(`ユーザーIDは${LOTTERY_CONSTANTS.MAX_USER_ID_LENGTH}文字以内で入力してください`);
    }

    if (!data.conversation_id || data.conversation_id <= 0) {
      errors.push('会話IDは必須です');
    } else if (!Number.isInteger(data.conversation_id)) {
      errors.push('会話IDは整数である必要があります');
    }

    // Optional fields validation
    if (data.template_id !== undefined) {
      if (!Number.isInteger(data.template_id) || data.template_id <= 0) {
        errors.push('テンプレートIDは1以上の整数である必要があります');
      }
    }

    if (data.exclude_prize_ids !== undefined) {
      if (!Array.isArray(data.exclude_prize_ids)) {
        errors.push('除外プライズIDは配列である必要があります');
      } else {
        for (const prizeId of data.exclude_prize_ids) {
          if (!Number.isInteger(prizeId) || prizeId <= 0) {
            errors.push('除外プライズIDは1以上の整数である必要があります');
          }
        }
      }
    }

    if (data.custom_weights !== undefined) {
      if (typeof data.custom_weights !== 'object' || data.custom_weights === null) {
        errors.push('カスタム重みはオブジェクトである必要があります');
      } else {
        const weightEntries = Object.entries(data.custom_weights);
        if (weightEntries.length > LOTTERY_CONSTANTS.MAX_CUSTOM_WEIGHTS) {
          errors.push(`カスタム重みは${LOTTERY_CONSTANTS.MAX_CUSTOM_WEIGHTS}個まで設定できます`);
        }

        for (const [prizeId, weight] of weightEntries) {
          const numericPrizeId = parseInt(prizeId, 10);
          if (isNaN(numericPrizeId) || numericPrizeId <= 0) {
            errors.push('カスタム重みのプライズIDは1以上の整数である必要があります');
          }
          if (typeof weight !== 'number' || weight < 0 || weight > 10) {
            errors.push('カスタム重みは0から10の間の数値である必要があります');
          }
        }
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static validateValidationRequest(data: LotteryValidationRequest): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Required fields validation
    if (!data.user_id || data.user_id.trim().length === 0) {
      errors.push('ユーザーIDは必須です');
    } else if (data.user_id.length > LOTTERY_CONSTANTS.MAX_USER_ID_LENGTH) {
      errors.push(`ユーザーIDは${LOTTERY_CONSTANTS.MAX_USER_ID_LENGTH}文字以内で入力してください`);
    }

    if (!data.template_id || data.template_id <= 0) {
      errors.push('テンプレートIDは必須です');
    } else if (!Number.isInteger(data.template_id)) {
      errors.push('テンプレートIDは整数である必要があります');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}