import { SelectOptionCreateRequest, SelectOptionUpdateRequest } from '../types/select_option_request';
import { SELECT_OPTION_CONSTANTS } from './select_option_constants';

export class SelectOptionValidator {
  static validateCreateRequest(data: SelectOptionCreateRequest): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Required fields validation
    if (!data.message_id || data.message_id <= 0) {
      errors.push('メッセージIDは必須です');
    } else if (!Number.isInteger(data.message_id)) {
      errors.push('メッセージIDは整数である必要があります');
    }

    if (!data.text || data.text.trim().length === 0) {
      errors.push('テキストは必須です');
    } else if (data.text.length > SELECT_OPTION_CONSTANTS.MAX_TEXT_LENGTH) {
      errors.push(`テキストは${SELECT_OPTION_CONSTANTS.MAX_TEXT_LENGTH}文字以内で入力してください`);
    }

    if (!data.value || data.value.trim().length === 0) {
      errors.push('値は必須です');
    } else if (data.value.length > SELECT_OPTION_CONSTANTS.MAX_VALUE_LENGTH) {
      errors.push(`値は${SELECT_OPTION_CONSTANTS.MAX_VALUE_LENGTH}文字以内で入力してください`);
    }

    // Optional fields validation
    if (data.step_order !== undefined) {
      if (!Number.isInteger(data.step_order) || data.step_order < 0) {
        errors.push('ステップ順序は0以上の整数である必要があります');
      } else if (data.step_order > SELECT_OPTION_CONSTANTS.MAX_STEP_ORDER) {
        errors.push(`ステップ順序は${SELECT_OPTION_CONSTANTS.MAX_STEP_ORDER}以下である必要があります`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static validateUpdateRequest(data: SelectOptionUpdateRequest): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Optional fields validation
    if (data.message_id !== undefined) {
      if (data.message_id <= 0 || !Number.isInteger(data.message_id)) {
        errors.push('メッセージIDは1以上の整数である必要があります');
      }
    }

    if (data.text !== undefined) {
      if (!data.text || data.text.trim().length === 0) {
        errors.push('テキストは空にできません');
      } else if (data.text.length > SELECT_OPTION_CONSTANTS.MAX_TEXT_LENGTH) {
        errors.push(`テキストは${SELECT_OPTION_CONSTANTS.MAX_TEXT_LENGTH}文字以内で入力してください`);
      }
    }

    if (data.value !== undefined) {
      if (!data.value || data.value.trim().length === 0) {
        errors.push('値は空にできません');
      } else if (data.value.length > SELECT_OPTION_CONSTANTS.MAX_VALUE_LENGTH) {
        errors.push(`値は${SELECT_OPTION_CONSTANTS.MAX_VALUE_LENGTH}文字以内で入力してください`);
      }
    }

    if (data.step_order !== undefined) {
      if (!Number.isInteger(data.step_order) || data.step_order < 0) {
        errors.push('ステップ順序は0以上の整数である必要があります');
      } else if (data.step_order > SELECT_OPTION_CONSTANTS.MAX_STEP_ORDER) {
        errors.push(`ステップ順序は${SELECT_OPTION_CONSTANTS.MAX_STEP_ORDER}以下である必要があります`);
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

  static validateQueryParams(query: any): { page: number; limit: number; filters: { message_id?: number } } {
    const page = Math.max(1, parseInt(query.page, 10) || 1);
    const limit = Math.min(SELECT_OPTION_CONSTANTS.MAX_PAGE_SIZE, Math.max(SELECT_OPTION_CONSTANTS.MIN_PAGE_SIZE, parseInt(query.limit, 10) || SELECT_OPTION_CONSTANTS.DEFAULT_PAGE_SIZE));
    
    const filters: { message_id?: number } = {};
    
    if (query.message_id) {
      const messageId = parseInt(query.message_id, 10);
      if (!isNaN(messageId) && messageId > 0) {
        filters.message_id = messageId;
      }
    }

    return { page, limit, filters };
  }
}