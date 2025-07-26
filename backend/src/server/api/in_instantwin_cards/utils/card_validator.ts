import { CardCreateRequest, CardUpdateRequest } from '../types/card_request';
import { CARD_CONSTANTS } from './card_constants';

export class CardValidator {
  static validateCreateRequest(data: CardCreateRequest): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Required fields validation
    if (!data.message_id || data.message_id <= 0) {
      errors.push('メッセージIDは必須です');
    } else if (!Number.isInteger(data.message_id)) {
      errors.push('メッセージIDは整数である必要があります');
    }

    // Optional fields validation
    if (data.title !== undefined && data.title.length > CARD_CONSTANTS.MAX_TITLE_LENGTH) {
      errors.push(`タイトルは${CARD_CONSTANTS.MAX_TITLE_LENGTH}文字以内で入力してください`);
    }

    if (data.subtitle !== undefined && data.subtitle.length > CARD_CONSTANTS.MAX_SUBTITLE_LENGTH) {
      errors.push(`サブタイトルは${CARD_CONSTANTS.MAX_SUBTITLE_LENGTH}文字以内で入力してください`);
    }

    if (data.image_url !== undefined && data.image_url.length > CARD_CONSTANTS.MAX_IMAGE_URL_LENGTH) {
      errors.push(`画像URLは${CARD_CONSTANTS.MAX_IMAGE_URL_LENGTH}文字以内で入力してください`);
    }

    if (data.url !== undefined && data.url.length > CARD_CONSTANTS.MAX_URL_LENGTH) {
      errors.push(`URLは${CARD_CONSTANTS.MAX_URL_LENGTH}文字以内で入力してください`);
    }

    if (data.step_order !== undefined) {
      if (!Number.isInteger(data.step_order) || data.step_order < 0) {
        errors.push('ステップ順序は0以上の整数である必要があります');
      } else if (data.step_order > CARD_CONSTANTS.MAX_STEP_ORDER) {
        errors.push(`ステップ順序は${CARD_CONSTANTS.MAX_STEP_ORDER}以下である必要があります`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static validateUpdateRequest(data: CardUpdateRequest): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Optional fields validation
    if (data.message_id !== undefined) {
      if (data.message_id <= 0 || !Number.isInteger(data.message_id)) {
        errors.push('メッセージIDは1以上の整数である必要があります');
      }
    }

    if (data.title !== undefined && data.title.length > CARD_CONSTANTS.MAX_TITLE_LENGTH) {
      errors.push(`タイトルは${CARD_CONSTANTS.MAX_TITLE_LENGTH}文字以内で入力してください`);
    }

    if (data.subtitle !== undefined && data.subtitle.length > CARD_CONSTANTS.MAX_SUBTITLE_LENGTH) {
      errors.push(`サブタイトルは${CARD_CONSTANTS.MAX_SUBTITLE_LENGTH}文字以内で入力してください`);
    }

    if (data.image_url !== undefined && data.image_url.length > CARD_CONSTANTS.MAX_IMAGE_URL_LENGTH) {
      errors.push(`画像URLは${CARD_CONSTANTS.MAX_IMAGE_URL_LENGTH}文字以内で入力してください`);
    }

    if (data.url !== undefined && data.url.length > CARD_CONSTANTS.MAX_URL_LENGTH) {
      errors.push(`URLは${CARD_CONSTANTS.MAX_URL_LENGTH}文字以内で入力してください`);
    }

    if (data.step_order !== undefined) {
      if (!Number.isInteger(data.step_order) || data.step_order < 0) {
        errors.push('ステップ順序は0以上の整数である必要があります');
      } else if (data.step_order > CARD_CONSTANTS.MAX_STEP_ORDER) {
        errors.push(`ステップ順序は${CARD_CONSTANTS.MAX_STEP_ORDER}以下である必要があります`);
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
    const limit = Math.min(CARD_CONSTANTS.MAX_PAGE_SIZE, Math.max(CARD_CONSTANTS.MIN_PAGE_SIZE, parseInt(query.limit, 10) || CARD_CONSTANTS.DEFAULT_PAGE_SIZE));
    
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