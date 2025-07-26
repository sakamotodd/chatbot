import { NodeCreateRequest, NodeUpdateRequest } from '../types/node_request';
import { NODE_CONSTANTS } from './node_constants';

export class NodeValidator {
  static validateCreateRequest(data: NodeCreateRequest): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Required fields validation
    if (!data.prize_id || data.prize_id <= 0) {
      errors.push('プライズIDは必須です');
    } else if (!Number.isInteger(data.prize_id)) {
      errors.push('プライズIDは整数である必要があります');
    }

    if (!data.type) {
      errors.push('ノードタイプは必須です');
    } else if (!(data.type in NODE_CONSTANTS.NODE_TYPE_MAP)) {
      errors.push('ノードタイプが不正です');
    }

    // Optional fields validation
    if (data.template_id !== undefined) {
      if (data.template_id <= 0 || !Number.isInteger(data.template_id)) {
        errors.push('テンプレートIDは1以上の整数である必要があります');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static validateUpdateRequest(data: NodeUpdateRequest): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Optional fields validation
    if (data.type !== undefined) {
      if (!data.type) {
        errors.push('ノードタイプは必須です');
      } else if (!(data.type in NODE_CONSTANTS.NODE_TYPE_MAP)) {
        errors.push('ノードタイプが不正です');
      }
    }

    if (data.template_id !== undefined) {
      if (data.template_id <= 0 || !Number.isInteger(data.template_id)) {
        errors.push('テンプレートIDは1以上の整数である必要があります');
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

  static validateQueryParams(query: any): { page: number; limit: number; filters: { template_id?: number; prize_id?: number; type?: number } } {
    const page = Math.max(1, parseInt(query.page, 10) || 1);
    const limit = Math.min(NODE_CONSTANTS.MAX_PAGE_SIZE, Math.max(NODE_CONSTANTS.MIN_PAGE_SIZE, parseInt(query.limit, 10) || NODE_CONSTANTS.DEFAULT_PAGE_SIZE));
    
    const filters: { template_id?: number; prize_id?: number; type?: number } = {};
    
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

    if (query.type && query.type in NODE_CONSTANTS.NODE_TYPE_MAP) {
      filters.type = NODE_CONSTANTS.NODE_TYPE_MAP[query.type as keyof typeof NODE_CONSTANTS.NODE_TYPE_MAP];
    }

    return { page, limit, filters };
  }

  static validateNodeType(nodeType: string): boolean {
    return nodeType in NODE_CONSTANTS.NODE_TYPE_MAP;
  }

  static getNodeTypeNumber(nodeType: string): number {
    return NODE_CONSTANTS.NODE_TYPE_MAP[nodeType as keyof typeof NODE_CONSTANTS.NODE_TYPE_MAP];
  }

  static getNodeTypeName(nodeTypeNumber: number): string {
    return NODE_CONSTANTS.NODE_TYPE_NAMES[nodeTypeNumber as keyof typeof NODE_CONSTANTS.NODE_TYPE_NAMES];
  }
}