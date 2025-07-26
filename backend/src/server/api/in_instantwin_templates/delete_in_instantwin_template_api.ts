import { Request, Response, NextFunction } from 'express';
import { InInstantwinTemplateService } from '../../services/in_instantwin_template_service';
import { ResponseHelper } from '../../utils/response';
import { TemplateValidator } from './utils/template_validator';
import { TEMPLATE_CONSTANTS } from './utils/template_constants';

export const deleteInInstantwinTemplate = async (
  req: Request<
    { id: string },
    Record<string, never>,
    Record<string, never>,
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

    // Delete template
    const deleteResult = await InInstantwinTemplateService.deleteTemplate(templateId);

    const responseData = {
      deleted_template_id: templateId,
      deleted_related_data: deleteResult,
    };

    ResponseHelper.success(res, responseData, TEMPLATE_CONSTANTS.MESSAGES.TEMPLATE_DELETED);
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

export default deleteInInstantwinTemplate;