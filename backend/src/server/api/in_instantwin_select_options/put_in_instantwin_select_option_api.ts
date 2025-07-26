import { Request, Response } from 'express';
import { InInstantwinSelectOptionService } from '../../services/in_instantwin_select_option_service';
import { SelectOptionValidator } from './utils/select_option_validator';
import { SELECT_OPTION_CONSTANTS } from './utils/select_option_constants';
import { ResponseHelper } from '../response_helper';
import { SelectOptionUpdateRequest } from './types/select_option_request';
import { SelectOptionDetailResponse } from './types/select_option_response';

export const putInInstantwinSelectOptionApi = async (req: Request, res: Response): Promise<void> => {
  try {
    const { isValid, numericId, error } = SelectOptionValidator.validateId(req.params.id);
    
    if (!isValid || !numericId) {
      ResponseHelper.badRequest(res, error || '無効なIDです');
      return;
    }

    const selectOptionData: SelectOptionUpdateRequest = req.body;

    const selectOption = await InInstantwinSelectOptionService.updateSelectOption(numericId, selectOptionData);
    
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

    ResponseHelper.success(res, response, SELECT_OPTION_CONSTANTS.MESSAGES.SELECT_OPTION_UPDATED);
  } catch (error) {
    console.error('Error in putInInstantwinSelectOptionApi:', error);
    
    if (error instanceof Error) {
      if (error.message.startsWith(SELECT_OPTION_CONSTANTS.ERROR_CODES.VALIDATION_ERROR)) {
        ResponseHelper.badRequest(res, error.message);
      } else if (error.message.startsWith(SELECT_OPTION_CONSTANTS.ERROR_CODES.MESSAGE_NOT_FOUND)) {
        ResponseHelper.notFound(res, 'メッセージが見つかりません');
      } else if (error.message.startsWith(SELECT_OPTION_CONSTANTS.ERROR_CODES.DUPLICATE_STEP_ORDER)) {
        ResponseHelper.badRequest(res, 'このステップ順序は既に使用されています');
      } else if (error.message.startsWith(SELECT_OPTION_CONSTANTS.ERROR_CODES.DUPLICATE_VALUE)) {
        ResponseHelper.badRequest(res, 'この値は既に使用されています');
      } else {
        ResponseHelper.internalServerError(res, '選択肢の更新に失敗しました');
      }
    } else {
      ResponseHelper.internalServerError(res, '選択肢の更新に失敗しました');
    }
  }
};