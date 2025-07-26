import { ButtonCreateRequest, ButtonUpdateRequest } from '../types/button_request';
import { BUTTON_CONSTANTS } from './button_constants';

export class ButtonValidator {
  static validateCreateRequest(data: ButtonCreateRequest): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Required fields validation
    if (!data.card_id || data.card_id <= 0) {
      errors.push('カードIDは必須です');
    } else if (!Number.isInteger(data.card_id)) {
      errors.push('カードIDは整数である必要があります');
    }

    if (!data.text || data.text.trim().length === 0) {
      errors.push('テキストは必須です');
    } else if (data.text.length > BUTTON_CONSTANTS.MAX_TEXT_LENGTH) {
      errors.push(`テキストは${BUTTON_CONSTANTS.MAX_TEXT_LENGTH}文字以内で入力してください`);
    }

    if (data.type === undefined || data.type === null) {
      errors.push('ボタンタイプは必須です');
    } else if (!Number.isInteger(data.type) || data.type < 0) {
      errors.push('ボタンタイプは0以上の整数である必要があります');
    } else if (!Object.values(BUTTON_CONSTANTS.BUTTON_TYPES).includes(data.type)) {
      errors.push('無効なボタンタイプです');
    }

    // Conditional validation based on button type
    if (data.type === BUTTON_CONSTANTS.BUTTON_TYPES.URL && (!data.url || data.url.trim().length === 0)) {
      errors.push('URLタイプのボタンにはURLが必要です');
    }

    if (data.type === BUTTON_CONSTANTS.BUTTON_TYPES.POSTBACK && (!data.value || data.value.trim().length === 0)) {
      errors.push('ポストバックタイプのボタンには値が必要です');
    }

    // Optional fields validation
    if (data.value !== undefined && data.value.length > BUTTON_CONSTANTS.MAX_VALUE_LENGTH) {
      errors.push(`値は${BUTTON_CONSTANTS.MAX_VALUE_LENGTH}文字以内で入力してください`);
    }

    if (data.url !== undefined && data.url.length > BUTTON_CONSTANTS.MAX_URL_LENGTH) {
      errors.push(`URLは${BUTTON_CONSTANTS.MAX_URL_LENGTH}文字以内で入力してください`);
    }

    if (data.step_order !== undefined) {
      if (!Number.isInteger(data.step_order) || data.step_order < 0) {
        errors.push('ステップ順序は0以上の整数である必要があります');
      } else if (data.step_order > BUTTON_CONSTANTS.MAX_STEP_ORDER) {
        errors.push(`ステップ順序は${BUTTON_CONSTANTS.MAX_STEP_ORDER}以下である必要があります`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static validateUpdateRequest(data: ButtonUpdateRequest): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Optional fields validation
    if (data.card_id !== undefined) {
      if (data.card_id <= 0 || !Number.isInteger(data.card_id)) {
        errors.push('カードIDは1以上の整数である必要があります');
      }
    }

    if (data.text !== undefined) {
      if (!data.text || data.text.trim().length === 0) {
        errors.push('テキストは空にできません');
      } else if (data.text.length > BUTTON_CONSTANTS.MAX_TEXT_LENGTH) {
        errors.push(`テキストは${BUTTON_CONSTANTS.MAX_TEXT_LENGTH}文字以内で入力してください`);
      }
    }

    if (data.type !== undefined) {
      if (!Number.isInteger(data.type) || data.type < 0) {
        errors.push('ボタンタイプは0以上の整数である必要があります');
      } else if (!Object.values(BUTTON_CONSTANTS.BUTTON_TYPES).includes(data.type)) {
        errors.push('無効なボタンタイプです');
      }
    }

    if (data.value !== undefined && data.value.length > BUTTON_CONSTANTS.MAX_VALUE_LENGTH) {
      errors.push(`値は${BUTTON_CONSTANTS.MAX_VALUE_LENGTH}文字以内で入力してください`);
    }

    if (data.url !== undefined && data.url.length > BUTTON_CONSTANTS.MAX_URL_LENGTH) {
      errors.push(`URLは${BUTTON_CONSTANTS.MAX_URL_LENGTH}文字以内で入力してください`);
    }

    if (data.step_order !== undefined) {
      if (!Number.isInteger(data.step_order) || data.step_order < 0) {
        errors.push('ステップ順序は0以上の整数である必要があります');
      } else if (data.step_order > BUTTON_CONSTANTS.MAX_STEP_ORDER) {
        errors.push(`ステップ順序は${BUTTON_CONSTANTS.MAX_STEP_ORDER}以下である必要があります`);
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

  static validateQueryParams(query: any): { page: number; limit: number; filters: { card_id?: number; type?: number } } {
    const page = Math.max(1, parseInt(query.page, 10) || 1);
    const limit = Math.min(BUTTON_CONSTANTS.MAX_PAGE_SIZE, Math.max(BUTTON_CONSTANTS.MIN_PAGE_SIZE, parseInt(query.limit, 10) || BUTTON_CONSTANTS.DEFAULT_PAGE_SIZE));
    
    const filters: { card_id?: number; type?: number } = {};
    
    if (query.card_id) {
      const cardId = parseInt(query.card_id, 10);
      if (!isNaN(cardId) && cardId > 0) {
        filters.card_id = cardId;
      }
    }

    if (query.type !== undefined && query.type !== null) {
      const type = parseInt(query.type, 10);
      if (!isNaN(type) && type >= 0) {
        filters.type = type;
      }
    }

    return { page, limit, filters };
  }
}