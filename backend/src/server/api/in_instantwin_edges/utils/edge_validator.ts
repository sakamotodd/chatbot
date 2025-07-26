import { EdgeCreateRequest, EdgeUpdateRequest } from '../types/edge_request';
import { EDGE_CONSTANTS } from './edge_constants';

export class EdgeValidator {
  static validateCreateRequest(data: EdgeCreateRequest): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Required fields validation
    if (!data.prize_id || data.prize_id <= 0) {
      errors.push('プライズIDは必須です');
    } else if (!Number.isInteger(data.prize_id)) {
      errors.push('プライズIDは整数である必要があります');
    }

    if (!data.source_node_id || data.source_node_id <= 0) {
      errors.push('ソースノードIDは必須です');
    } else if (!Number.isInteger(data.source_node_id)) {
      errors.push('ソースノードIDは整数である必要があります');
    }

    if (!data.target_node_id || data.target_node_id <= 0) {
      errors.push('ターゲットノードIDは必須です');
    } else if (!Number.isInteger(data.target_node_id)) {
      errors.push('ターゲットノードIDは整数である必要があります');
    }

    // Check for self-reference
    if (data.source_node_id === data.target_node_id) {
      errors.push('ソースノードとターゲットノードは同じにできません');
    }

    // Optional fields validation
    if (data.template_id !== undefined) {
      if (data.template_id <= 0 || !Number.isInteger(data.template_id)) {
        errors.push('テンプレートIDは1以上の整数である必要があります');
      }
    }

    if (data.condition !== undefined && data.condition.length > EDGE_CONSTANTS.MAX_CONDITION_LENGTH) {
      errors.push(`条件は${EDGE_CONSTANTS.MAX_CONDITION_LENGTH}文字以内で入力してください`);
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static validateUpdateRequest(data: EdgeUpdateRequest): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Optional fields validation
    if (data.source_node_id !== undefined) {
      if (data.source_node_id <= 0 || !Number.isInteger(data.source_node_id)) {
        errors.push('ソースノードIDは1以上の整数である必要があります');
      }
    }

    if (data.target_node_id !== undefined) {
      if (data.target_node_id <= 0 || !Number.isInteger(data.target_node_id)) {
        errors.push('ターゲットノードIDは1以上の整数である必要があります');
      }
    }

    // Check for self-reference if both are provided
    if (data.source_node_id !== undefined && data.target_node_id !== undefined) {
      if (data.source_node_id === data.target_node_id) {
        errors.push('ソースノードとターゲットノードは同じにできません');
      }
    }

    if (data.template_id !== undefined) {
      if (data.template_id <= 0 || !Number.isInteger(data.template_id)) {
        errors.push('テンプレートIDは1以上の整数である必要があります');
      }
    }

    if (data.condition !== undefined && data.condition.length > EDGE_CONSTANTS.MAX_CONDITION_LENGTH) {
      errors.push(`条件は${EDGE_CONSTANTS.MAX_CONDITION_LENGTH}文字以内で入力してください`);
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

  static validateQueryParams(query: any): { page: number; limit: number; filters: { template_id?: number; prize_id?: number; source_node_id?: number; target_node_id?: number } } {
    const page = Math.max(1, parseInt(query.page, 10) || 1);
    const limit = Math.min(EDGE_CONSTANTS.MAX_PAGE_SIZE, Math.max(EDGE_CONSTANTS.MIN_PAGE_SIZE, parseInt(query.limit, 10) || EDGE_CONSTANTS.DEFAULT_PAGE_SIZE));
    
    const filters: { template_id?: number; prize_id?: number; source_node_id?: number; target_node_id?: number } = {};
    
    if (query.template_id) {
      const templateId = parseInt(query.template_id, 10);
      if (!isNaN(templateId) && templateId > 0) {
        filters.template_id = templateId;
      }
    }

    if (query.prize_id) {
      const prizeId = parseInt(query.prize_id, 10);
      if (!isNaN(prizeId) && prizeId > 0) {
        filters.prize_id = prizeId;
      }
    }

    if (query.source_node_id) {
      const sourceNodeId = parseInt(query.source_node_id, 10);
      if (!isNaN(sourceNodeId) && sourceNodeId > 0) {
        filters.source_node_id = sourceNodeId;
      }
    }

    if (query.target_node_id) {
      const targetNodeId = parseInt(query.target_node_id, 10);
      if (!isNaN(targetNodeId) && targetNodeId > 0) {
        filters.target_node_id = targetNodeId;
      }
    }

    return { page, limit, filters };
  }
}