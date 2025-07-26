import { Request, Response, NextFunction } from 'express';
import { InInstantwinTemplateService } from '../../services/in_instantwin_template_service';
import { ResponseHelper } from '../../utils/response';
import { TemplateValidator } from './utils/template_validator';
import { TEMPLATE_CONSTANTS } from './utils/template_constants';
import { TemplateUpdateRequest } from './types/template_request';

export const putInInstantwinTemplate = async (
  req: Request<
    { id: string },
    Record<string, never>,
    TemplateUpdateRequest,
    Record<string, never>
  >,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const idValidation = TemplateValidator.validateId(req.params.id);
    if (!idValidation.isValid) {
      ResponseHelper.badRequest(res, idValidation.error || '無効なテンプレートIDです');
      return;
    }

    const templateId = idValidation.numericId!;

    // Validate request body
    const validation = TemplateValidator.validateUpdateRequest(req.body);
    if (!validation.isValid) {
      ResponseHelper.badRequest(res, '入力値に不正があります', {
        code: TEMPLATE_CONSTANTS.ERROR_CODES.VALIDATION_ERROR,
        details: validation.errors.map(error => ({ message: error })),
      });
      return;
    }

    // Update template
    const updatedTemplate = await InInstantwinTemplateService.updateTemplate(templateId, req.body);

    ResponseHelper.success(res, true, TEMPLATE_CONSTANTS.MESSAGES.TEMPLATE_UPDATED);
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

export default putInInstantwinTemplate;