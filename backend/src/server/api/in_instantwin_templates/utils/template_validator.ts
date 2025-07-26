import { TemplateCreateRequest, TemplateUpdateRequest } from '../types/template_request';
import { TEMPLATE_CONSTANTS } from './template_constants';

export class TemplateValidator {
  static validateCreateRequest(data: TemplateCreateRequest): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Required fields validation
    if (!data.name || data.name.trim().length === 0) {
      errors.push('テンプレート名は必須です');
    } else if (data.name.length > TEMPLATE_CONSTANTS.MAX_NAME_LENGTH) {
      errors.push(`テンプレート名は${TEMPLATE_CONSTANTS.MAX_NAME_LENGTH}文字以内で入力してください`);
    }

    if (!data.type) {
      errors.push('テンプレートタイプは必須です');
    } else if (!(data.type in TEMPLATE_CONSTANTS.TEMPLATE_TYPE_MAP)) {
      errors.push('テンプレートタイプが不正です');
    }

    // Optional fields validation
    if (data.step_order !== undefined) {
      if (data.step_order < TEMPLATE_CONSTANTS.MIN_STEP_ORDER || !Number.isInteger(data.step_order)) {
        errors.push('ステップ順序は1以上の整数である必要があります');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static validateUpdateRequest(data: TemplateUpdateRequest): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Optional fields validation
    if (data.name !== undefined) {
      if (!data.name || data.name.trim().length === 0) {
        errors.push('テンプレート名は必須です');
      } else if (data.name.length > TEMPLATE_CONSTANTS.MAX_NAME_LENGTH) {
        errors.push(`テンプレート名は${TEMPLATE_CONSTANTS.MAX_NAME_LENGTH}文字以内で入力してください`);
      }
    }

    if (data.step_order !== undefined) {
      if (data.step_order < TEMPLATE_CONSTANTS.MIN_STEP_ORDER || !Number.isInteger(data.step_order)) {
        errors.push('ステップ順序は1以上の整数である必要があります');
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

  static validateQueryParams(query: any): { 
    page: number; 
    limit: number; 
    includes: { nodes: boolean; messages: boolean; select_options: boolean } 
  } {
    // Pagination
    const page = Math.max(1, parseInt(query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(query.limit) || 20));

    const includes = {
      nodes: query.include_nodes === 'true',
      messages: query.include_messages === 'true',
      select_options: query.include_select_options === 'true'
    };

    return { page, limit, includes };
  }

  static validateTemplateType(templateType: string): boolean {
    return templateType in TEMPLATE_CONSTANTS.TEMPLATE_TYPE_MAP;
  }

  static isRequiredTemplate(templateType: string): boolean {
    return TEMPLATE_CONSTANTS.REQUIRED_TEMPLATES.includes(templateType);
  }

  static getTemplateTypeNumber(templateType: string): number {
    return TEMPLATE_CONSTANTS.TEMPLATE_TYPE_MAP[templateType as keyof typeof TEMPLATE_CONSTANTS.TEMPLATE_TYPE_MAP];
  }

  static getTemplateTypeName(templateTypeNumber: number): string {
    return TEMPLATE_CONSTANTS.TEMPLATE_TYPE_NAMES[templateTypeNumber as keyof typeof TEMPLATE_CONSTANTS.TEMPLATE_TYPE_NAMES];
  }
}