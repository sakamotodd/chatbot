import { PrizeCreateRequest, PrizeUpdateRequest } from '../types/prize_request';

export class PrizeValidator {
  static validateCreateRequest(data: PrizeCreateRequest): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Required fields validation
    if (!data.name || data.name.trim().length === 0) {
      errors.push('プライズ名は必須です');
    } else if (data.name.length > 255) {
      errors.push('プライズ名は255文字以内で入力してください');
    }

    if (!data.winner_count || data.winner_count < 1) {
      errors.push('当選者数は1以上である必要があります');
    } else if (!Number.isInteger(data.winner_count)) {
      errors.push('当選者数は整数である必要があります');
    }

    // Optional fields validation
    if (data.description && data.description.length > 1000) {
      errors.push('プライズ説明は1000文字以内で入力してください');
    }

    if (data.winning_rate !== undefined) {
      if (data.winning_rate < 0 || data.winning_rate > 100) {
        errors.push('当選確率は0-100の範囲で入力してください');
      }
    }

    if (data.daily_winner_count !== undefined) {
      if (data.daily_winner_count < 1 || !Number.isInteger(data.daily_winner_count)) {
        errors.push('日次当選者数は1以上の整数である必要があります');
      }
    }

    if (data.lottery_count_per_minute !== undefined) {
      if (data.lottery_count_per_minute < 1 || !Number.isInteger(data.lottery_count_per_minute)) {
        errors.push('分間抽選回数制限は1以上の整数である必要があります');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static validateUpdateRequest(data: PrizeUpdateRequest, currentWinnerCount?: number): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Optional fields validation
    if (data.name !== undefined) {
      if (!data.name || data.name.trim().length === 0) {
        errors.push('プライズ名は必須です');
      } else if (data.name.length > 255) {
        errors.push('プライズ名は255文字以内で入力してください');
      }
    }

    if (data.description !== undefined && data.description.length > 1000) {
      errors.push('プライズ説明は1000文字以内で入力してください');
    }

    if (data.winner_count !== undefined) {
      if (data.winner_count < 1 || !Number.isInteger(data.winner_count)) {
        errors.push('当選者数は1以上の整数である必要があります');
      } else if (currentWinnerCount !== undefined && data.winner_count < currentWinnerCount) {
        errors.push('当選者数は現在の当選者数より小さくできません');
      }
    }

    if (data.winning_rate !== undefined) {
      if (data.winning_rate < 0 || data.winning_rate > 100) {
        errors.push('当選確率は0-100の範囲で入力してください');
      }
    }

    if (data.daily_winner_count !== undefined) {
      if (data.daily_winner_count < 1 || !Number.isInteger(data.daily_winner_count)) {
        errors.push('日次当選者数は1以上の整数である必要があります');
      }
    }

    if (data.lottery_count_per_minute !== undefined) {
      if (data.lottery_count_per_minute < 1 || !Number.isInteger(data.lottery_count_per_minute)) {
        errors.push('分間抽選回数制限は1以上の整数である必要があります');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static validateId(id: string): { isValid: boolean; numericId?: number; error?: string } {
    const numericId = parseInt(id, 10);
    
    if (isNaN(numericId) || numericId <= 0) {
      return {
        isValid: false,
        error: '無効なIDです'
      };
    }

    return {
      isValid: true,
      numericId
    };
  }

  static validateQueryParams(query: any): { page: number; limit: number; includes: { templates: boolean; nodes: boolean; messages: boolean } } {
    const page = Math.max(1, parseInt(query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(query.limit, 10) || 10));
    
    const includes = {
      templates: query.include_templates !== 'false',
      nodes: query.include_nodes === 'true',
      messages: query.include_messages === 'true'
    };

    return { page, limit, includes };
  }
}