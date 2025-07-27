import { Request, Response } from 'express';
import { FlowValidationService } from '../../services/flow_validation_service';
import { FlowValidator } from './utils/flow_validator';
import { FLOW_CONSTANTS } from './utils/flow_constants';
import { ResponseHelper } from '../../utils/response';
import { FlowValidationResponse } from './types/flow_response';

export const getFlowValidationApi = async (req: Request, res: Response): Promise<void> => {
  try {
    const { isValid, numericId, error } = FlowValidator.validateId(req.params.template_id);
    
    if (!isValid || !numericId) {
      ResponseHelper.badRequest(res, error || '無効なテンプレートIDです');
      return;
    }

    // Perform flow validation
    const result = await FlowValidationService.validateFlow(numericId);

    const response: FlowValidationResponse = {
      flow_validation: {
        is_valid: result.is_valid,
        errors: result.errors,
        warnings: result.warnings,
        statistics: result.statistics,
      },
    };

    const message = result.is_valid 
      ? FLOW_CONSTANTS.MESSAGES.FLOW_VALID 
      : FLOW_CONSTANTS.MESSAGES.FLOW_INVALID;

    ResponseHelper.success(res, response, message);
  } catch (error) {
    console.error('Error in getFlowValidationApi:', error);
    
    if (error instanceof Error) {
      if (error.message.startsWith(FLOW_CONSTANTS.ERROR_CODES.TEMPLATE_NOT_FOUND)) {
        ResponseHelper.notFound(res, 'テンプレートが見つかりません');
      } else if (error.message.startsWith(FLOW_CONSTANTS.ERROR_CODES.NO_NODES_FOUND)) {
        ResponseHelper.badRequest(res, 'テンプレートにノードが見つかりません');
      } else {
        ResponseHelper.internalError(res, 'フロー検証に失敗しました');
      }
    } else {
      ResponseHelper.internalError(res, 'フロー検証に失敗しました');
    }
  }
};