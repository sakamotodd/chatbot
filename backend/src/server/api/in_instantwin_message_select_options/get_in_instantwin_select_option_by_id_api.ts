import { Request, Response } from 'express';
import { InInstantwinMessageSelectOptionService } from '../../services/in_instantwin_select_option_service';
import { SelectOptionValidator } from './utils/select_option_validator';
import { SELECT_OPTION_CONSTANTS } from './utils/select_option_constants';
import { ResponseHelper } from '../../utils/response';
import { SelectOptionDetailResponse } from './types/select_option_response';

export const getInInstantwinSelectOptionByIdApi = async (req: Request, res: Response): Promise<void> => {
  try {
    const { isValid, numericId, error } = SelectOptionValidator.validateId(req.params.id);
    
    if (!isValid || !numericId) {
      ResponseHelper.badRequest(res, error || '無効なIDです');
      return;
    }

    const selectOption = await InInstantwinMessageSelectOptionService.getSelectOptionById(numericId);
    
    if (!selectOption) {
      ResponseHelper.notFound(res, '選択肢が見つかりません');
      return;
    }

    const response: SelectOptionDetailResponse = {
      in_instantwin_select_option: {
        id: selectOption.id,
        message_id: selectOption.message_id,
        text: selectOption.text,
        value: selectOption.value,
        step_order: selectOption.step_order,
        created: selectOption.created,
        modified: selectOption.modified,
      },
    };

    ResponseHelper.success(res, response, SELECT_OPTION_CONSTANTS.MESSAGES.SELECT_OPTION_RETRIEVED);
  } catch (error) {
    console.error('Error in getInInstantwinSelectOptionByIdApi:', error);
    ResponseHelper.internalError(res, '選択肢の取得に失敗しました');
  }
};