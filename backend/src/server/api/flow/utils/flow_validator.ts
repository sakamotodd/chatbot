import { FlowValidationRequest } from '../types/flow_request';
import { FLOW_CONSTANTS } from './flow_constants';

export class FlowValidator {
  static validateFlowValidationRequest(data: FlowValidationRequest): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Required fields validation
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
}