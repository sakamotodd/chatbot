import { Request, Response } from 'express';
import { FlowValidationService } from '../../services/flow_validation_service';
import { FlowValidator } from './utils/flow_validator';
import { FLOW_CONSTANTS } from './utils/flow_constants';
import { ResponseHelper } from '../../utils/response';
import { FlowValidationRequest } from './types/flow_request';
import { FlowValidationResponse } from './types/flow_response';

export const postFlowValidationApi = async (req: Request, res: Response): Promise<void> => {
  try {
    const validationData: FlowValidationRequest = req.body;

    // Validate request data
    const validation = FlowValidator.validateFlowValidationRequest(validationData);
    if (!validation.isValid) {
      ResponseHelper.badRequest(res, `${FLOW_CONSTANTS.ERROR_CODES.VALIDATION_ERROR}: ${validation.errors.join(', ')}`);
      return;
    }

    // Perform flow validation
    const result = await FlowValidationService.validateFlow(validationData.template_id);

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
    console.error('Error in postFlowValidationApi:', error);
    
    if (error instanceof Error) {
      if (error.message.startsWith(FLOW_CONSTANTS.ERROR_CODES.TEMPLATE_NOT_FOUND)) {
        ResponseHelper.notFound(res, 'テンプレートが見つかりません');
      } else if (error.message.startsWith(FLOW_CONSTANTS.ERROR_CODES.NO_NODES_FOUND)) {
        ResponseHelper.badRequest(res, 'テンプレートにノードが見つかりません');
      } else if (error.message.startsWith(FLOW_CONSTANTS.ERROR_CODES.VALIDATION_ERROR)) {
        ResponseHelper.badRequest(res, error.message);
      } else {
        ResponseHelper.internalError(res, 'フロー検証に失敗しました');
      }
    } else {
      ResponseHelper.internalError(res, 'フロー検証に失敗しました');
    }
  }
};