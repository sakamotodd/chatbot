import { ConversationCreateRequest, ConversationUpdateRequest } from '../types/conversation_request';
import { CONVERSATION_CONSTANTS } from './conversation_constants';

export class ConversationValidator {
  static validateCreateRequest(data: ConversationCreateRequest): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Required fields validation
    if (!data.template_id || data.template_id <= 0) {
      errors.push('テンプレートIDは必須です');
    } else if (!Number.isInteger(data.template_id)) {
      errors.push('テンプレートIDは整数である必要があります');
    }

    if (!data.user_id || data.user_id.trim().length === 0) {
      errors.push('ユーザーIDは必須です');
    } else if (data.user_id.length > CONVERSATION_CONSTANTS.MAX_USER_ID_LENGTH) {
      errors.push(`ユーザーIDは${CONVERSATION_CONSTANTS.MAX_USER_ID_LENGTH}文字以内で入力してください`);
    }

    // Optional fields validation
    if (data.status !== undefined) {
      if (!Number.isInteger(data.status) || data.status < 0) {
        errors.push('ステータスは0以上の整数である必要があります');
      } else if (!Object.values(CONVERSATION_CONSTANTS.CONVERSATION_STATUS).includes(data.status)) {
        errors.push('無効な会話ステータスです');
      }
    }

    if (data.current_node_id !== undefined) {
      if (!Number.isInteger(data.current_node_id) || data.current_node_id <= 0) {
        errors.push('現在のノードIDは1以上の整数である必要があります');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static validateUpdateRequest(data: ConversationUpdateRequest): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Optional fields validation
    if (data.template_id !== undefined) {
      if (data.template_id <= 0 || !Number.isInteger(data.template_id)) {
        errors.push('テンプレートIDは1以上の整数である必要があります');
      }
    }

    if (data.user_id !== undefined) {
      if (!data.user_id || data.user_id.trim().length === 0) {
        errors.push('ユーザーIDは空にできません');
      } else if (data.user_id.length > CONVERSATION_CONSTANTS.MAX_USER_ID_LENGTH) {
        errors.push(`ユーザーIDは${CONVERSATION_CONSTANTS.MAX_USER_ID_LENGTH}文字以内で入力してください`);
      }
    }

    if (data.status !== undefined) {
      if (!Number.isInteger(data.status) || data.status < 0) {
        errors.push('ステータスは0以上の整数である必要があります');
      } else if (!Object.values(CONVERSATION_CONSTANTS.CONVERSATION_STATUS).includes(data.status)) {
        errors.push('無効な会話ステータスです');
      }
    }

    if (data.current_node_id !== undefined) {
      if (!Number.isInteger(data.current_node_id) || data.current_node_id <= 0) {
        errors.push('現在のノードIDは1以上の整数である必要があります');
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

  static validateQueryParams(query: any): { page: number; limit: number; filters: { template_id?: number; user_id?: string; status?: number } } {
    const page = Math.max(1, parseInt(query.page, 10) || 1);
    const limit = Math.min(CONVERSATION_CONSTANTS.MAX_PAGE_SIZE, Math.max(CONVERSATION_CONSTANTS.MIN_PAGE_SIZE, parseInt(query.limit, 10) || CONVERSATION_CONSTANTS.DEFAULT_PAGE_SIZE));
    
    const filters: { template_id?: number; user_id?: string; status?: number } = {};
    
    if (query.template_id) {
      const templateId = parseInt(query.template_id, 10);
      if (!isNaN(templateId) && templateId > 0) {
        filters.template_id = templateId;
      }
    }

    if (query.user_id && typeof query.user_id === 'string') {
      filters.user_id = query.user_id;
    }

    if (query.status !== undefined && query.status !== null) {
      const status = parseInt(query.status, 10);
      if (!isNaN(status) && status >= 0) {
        filters.status = status;
      }
    }

    return { page, limit, filters };
  }
}