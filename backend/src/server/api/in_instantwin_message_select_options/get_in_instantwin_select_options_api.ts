import { Request, Response } from 'express';
import { InInstantwinMessageSelectOptionService } from '../../services/in_instantwin_select_option_service';
import { SelectOptionValidator } from './utils/select_option_validator';
import { SELECT_OPTION_CONSTANTS } from './utils/select_option_constants';
import { ResponseHelper } from '../../utils/response';
import { SelectOptionListResponse } from './types/select_option_response';

export const getInInstantwinSelectOptionsApi = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page, limit, filters } = SelectOptionValidator.validateQueryParams(req.query);

    const { selectOptions, pagination } = await InInstantwinMessageSelectOptionService.getSelectOptions(filters, page, limit);

    const response: SelectOptionListResponse = {
      in_instantwin_message_select_options: selectOptions.map(option => ({
        id: option.id,
        message_id: option.message_id,
        text: option.text,
        value: option.value,
        step_order: option.step_order,
        created: option.created,
        modified: option.modified,
      })),
      pagination,
    };

    ResponseHelper.success(res, response, SELECT_OPTION_CONSTANTS.MESSAGES.SELECT_OPTIONS_RETRIEVED);
  } catch (error) {
    console.error('Error in getInInstantwinSelectOptionsApi:', error);
    
    if (error instanceof Error && error.message.startsWith(SELECT_OPTION_CONSTANTS.ERROR_CODES.VALIDATION_ERROR)) {
      ResponseHelper.badRequest(res, error.message);
    } else {
      ResponseHelper.internalError(res, '選択肢一覧の取得に失敗しました');
    }
  }
};