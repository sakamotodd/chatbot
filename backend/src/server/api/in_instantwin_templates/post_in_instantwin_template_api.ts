import { Request, Response, NextFunction } from 'express';
import { InInstantwinTemplateService } from '../../services/in_instantwin_template_service';
import { ResponseHelper } from '../../utils/response';
import { TemplateValidator } from './utils/template_validator';
import { TEMPLATE_CONSTANTS } from './utils/template_constants';
import { TemplateCreateRequest } from './types/template_request';

export const postInInstantwinTemplate = async (
  req: Request<
    { prizeId: string },
    Record<string, never>,
    TemplateCreateRequest,
    Record<string, never>
  >,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const prizeIdValidation = TemplateValidator.validateId(req.params.prizeId);
    if (!prizeIdValidation.isValid) {
      ResponseHelper.badRequest(res, prizeIdValidation.error || '無効なプライズIDです');
      return;
    }

    const prizeId = prizeIdValidation.numericId!;

    // Validate request body
    const validation = TemplateValidator.validateCreateRequest(req.body);
    if (!validation.isValid) {
      ResponseHelper.badRequest(res, '入力値に不正があります', {
        code: TEMPLATE_CONSTANTS.ERROR_CODES.VALIDATION_ERROR,
        details: validation.errors.map(error => ({ message: error })),
      });
      return;
    }

    // Create template
    const template = await InInstantwinTemplateService.createTemplate(prizeId, req.body);

    ResponseHelper.created(res, true, TEMPLATE_CONSTANTS.MESSAGES.TEMPLATE_CREATED);
  } catch (error: any) {
    if (error.statusCode === 404) {
      ResponseHelper.notFound(res, error.message, error.code);
      return;
    }
    if (error.statusCode === 409) {
      ResponseHelper.conflict(res, error.message, {
        code: error.code,
        details: error.details,
      });
      return;
    }
    next(error);
  }
};

export default postInInstantwinTemplate;