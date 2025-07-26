import { MessageCreateRequest, MessageUpdateRequest } from '../types/message_request';
import { MESSAGE_CONSTANTS } from './message_constants';

export class MessageValidator {
  static validateCreateRequest(data: MessageCreateRequest): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Required fields validation
    if (!data.node_id || data.node_id <= 0) {
      errors.push('ノードIDは必須です');
    } else if (!Number.isInteger(data.node_id)) {
      errors.push('ノードIDは整数である必要があります');
    }

    if (data.type === undefined || data.type === null) {
      errors.push('メッセージタイプは必須です');
    } else if (!Number.isInteger(data.type) || data.type < 0) {
      errors.push('メッセージタイプは0以上の整数である必要があります');
    } else if (!Object.values(MESSAGE_CONSTANTS.MESSAGE_TYPES).includes(data.type)) {
      errors.push('無効なメッセージタイプです');
    }

    if (!data.content || data.content.trim().length === 0) {
      errors.push('コンテンツは必須です');
    } else if (data.content.length > MESSAGE_CONSTANTS.MAX_CONTENT_LENGTH) {
      errors.push(`コンテンツは${MESSAGE_CONSTANTS.MAX_CONTENT_LENGTH}文字以内で入力してください`);
    }

    // Optional fields validation
    if (data.step_order !== undefined) {
      if (!Number.isInteger(data.step_order) || data.step_order < 0) {
        errors.push('ステップ順序は0以上の整数である必要があります');
      } else if (data.step_order > MESSAGE_CONSTANTS.MAX_STEP_ORDER) {
        errors.push(`ステップ順序は${MESSAGE_CONSTANTS.MAX_STEP_ORDER}以下である必要があります`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static validateUpdateRequest(data: MessageUpdateRequest): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Optional fields validation
    if (data.node_id !== undefined) {
      if (data.node_id <= 0 || !Number.isInteger(data.node_id)) {
        errors.push('ノードIDは1以上の整数である必要があります');
      }
    }

    if (data.type !== undefined) {
      if (!Number.isInteger(data.type) || data.type < 0) {
        errors.push('メッセージタイプは0以上の整数である必要があります');
      } else if (!Object.values(MESSAGE_CONSTANTS.MESSAGE_TYPES).includes(data.type)) {
        errors.push('無効なメッセージタイプです');
      }
    }

    if (data.content !== undefined) {
      if (!data.content || data.content.trim().length === 0) {
        errors.push('コンテンツは空にできません');
      } else if (data.content.length > MESSAGE_CONSTANTS.MAX_CONTENT_LENGTH) {
        errors.push(`コンテンツは${MESSAGE_CONSTANTS.MAX_CONTENT_LENGTH}文字以内で入力してください`);
      }
    }

    if (data.step_order !== undefined) {
      if (!Number.isInteger(data.step_order) || data.step_order < 0) {
        errors.push('ステップ順序は0以上の整数である必要があります');
      } else if (data.step_order > MESSAGE_CONSTANTS.MAX_STEP_ORDER) {
        errors.push(`ステップ順序は${MESSAGE_CONSTANTS.MAX_STEP_ORDER}以下である必要があります`);
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

  static validateQueryParams(query: any): { page: number; limit: number; filters: { node_id?: number; type?: number } } {
    const page = Math.max(1, parseInt(query.page, 10) || 1);
    const limit = Math.min(MESSAGE_CONSTANTS.MAX_PAGE_SIZE, Math.max(MESSAGE_CONSTANTS.MIN_PAGE_SIZE, parseInt(query.limit, 10) || MESSAGE_CONSTANTS.DEFAULT_PAGE_SIZE));
    
    const filters: { node_id?: number; type?: number } = {};
    
    if (query.node_id) {
      const nodeId = parseInt(query.node_id, 10);
      if (!isNaN(nodeId) && nodeId > 0) {
        filters.node_id = nodeId;
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