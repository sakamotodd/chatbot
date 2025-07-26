import { Request, Response, NextFunction } from 'express';
import { InInstantwinTemplateService } from '../../services/in_instantwin_template_service';
import { ResponseHelper } from '../../utils/response';
import { TemplateValidator } from './utils/template_validator';
import { TEMPLATE_CONSTANTS } from './utils/template_constants';
import { TemplateQueryParams } from './types/template_request';

export const getInInstantwinTemplateById = async (
  req: Request<
    { id: string },
    Record<string, never>,
    Record<string, never>,
    TemplateQueryParams
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
    const { includes } = TemplateValidator.validateQueryParams(req.query);

    const template = await InInstantwinTemplateService.getTemplateById(templateId, {
      include_nodes: includes.nodes,
      include_messages: includes.messages,
      include_select_options: includes.selectOptions,
    });

    const templateData: any = {
      id: template.id,
      prize_id: template.prize_id,
      name: template.name,
      type: template.type,
      step_order: template.step_order,
      is_active: template.is_active,
      created: template.created,
      modified: template.modified,
    };

    // Add included relations
    const templateWithRelations = template as any;
    if (includes.nodes && templateWithRelations.nodes) {
      templateData.in_instantwin_nodes = templateWithRelations.nodes;
    }
    if (includes.messages && templateWithRelations.messages) {
      templateData.in_instantwin_messages = templateWithRelations.messages;
    }
    if (includes.selectOptions && templateWithRelations.selectOptions) {
      templateData.in_instantwin_message_select_options = templateWithRelations.selectOptions;
    }

    const responseData = {
      in_instantwin_template: templateData,
    };

    ResponseHelper.success(res, responseData, TEMPLATE_CONSTANTS.MESSAGES.TEMPLATE_RETRIEVED);
  } catch (error: any) {
    if (error.statusCode === 404) {
      ResponseHelper.notFound(res, error.message, error.code);
      return;
    }
    next(error);
  }
};

export default getInInstantwinTemplateById;