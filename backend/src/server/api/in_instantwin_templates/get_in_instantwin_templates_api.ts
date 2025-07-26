import { Request, Response, NextFunction } from 'express';
import { InInstantwinTemplateService } from '../../services/in_instantwin_template_service';
import { ResponseHelper } from '../../utils/response';
import { TemplateValidator } from './utils/template_validator';
import { TEMPLATE_CONSTANTS } from './utils/template_constants';
import { TemplateQueryParams } from './types/template_request';

export const getInInstantwinTemplates = async (
  req: Request<
    { prizeId: string },
    Record<string, never>,
    Record<string, never>,
    TemplateQueryParams
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
    const { page, limit, includes } = TemplateValidator.validateQueryParams(req.query);

    const result = await InInstantwinTemplateService.getAllTemplates(prizeId, {
      page,
      limit,
      include_nodes: includes.nodes,
      include_messages: includes.messages,
      include_select_options: includes.select_options,
    });

    const responseData = {
      in_instantwin_templates: result.templates.map(template => {
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
        if (includes.select_options && templateWithRelations.selectOptions) {
          templateData.in_instantwin_message_select_options = templateWithRelations.selectOptions;
        }

        return templateData;
      }),
      pagination: result.pagination,
    };

    ResponseHelper.success(res, responseData, TEMPLATE_CONSTANTS.MESSAGES.TEMPLATES_RETRIEVED);
  } catch (error: any) {
    if (error.statusCode === 404) {
      ResponseHelper.notFound(res, error.message, error.code);
      return;
    }
    next(error);
  }
};

export default getInInstantwinTemplates;