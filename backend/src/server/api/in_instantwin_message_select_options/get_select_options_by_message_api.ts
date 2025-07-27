import { Request, Response } from 'express';
import { InInstantwinMessageSelectOptionService } from '../../services/in_instantwin_select_option_service';
import { SelectOptionValidator } from './utils/select_option_validator';
import { SELECT_OPTION_CONSTANTS } from './utils/select_option_constants';
import { ResponseHelper } from '../../utils/response';
import { SelectOptionResponse } from './types/select_option_response';

export const getSelectOptionsByMessageApi = async (req: Request, res: Response): Promise<void> => {
  try {
    const { isValid, numericId, error } = SelectOptionValidator.validateId(req.params.message_id);
    
    if (!isValid || !numericId) {
      ResponseHelper.badRequest(res, error || '無効なメッセージIDです');
      return;
    }

    const selectOptions = await InInstantwinMessageSelectOptionService.getSelectOptionsByMessageId(numericId);

    const response: { select_options: SelectOptionResponse[] } = {
      select_options: selectOptions.map(option => ({
        id: option.id,
        message_id: option.message_id,
        text: option.text,
        value: option.value,
        step_order: option.step_order,
        created: option.created,
        modified: option.modified,
      })),
    };

    ResponseHelper.success(res, response, SELECT_OPTION_CONSTANTS.MESSAGES.SELECT_OPTIONS_RETRIEVED);
  } catch (error) {
    console.error('Error in getSelectOptionsByMessageApi:', error);
    ResponseHelper.internalError(res, 'メッセージの選択肢取得に失敗しました');
  }
};