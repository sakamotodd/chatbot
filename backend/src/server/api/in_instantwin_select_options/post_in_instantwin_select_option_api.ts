import { Request, Response } from 'express';
import { InInstantwinSelectOptionService } from '../../services/in_instantwin_select_option_service';
import { SELECT_OPTION_CONSTANTS } from './utils/select_option_constants';
import { ResponseHelper } from '../response_helper';
import { SelectOptionCreateRequest } from './types/select_option_request';
import { SelectOptionDetailResponse } from './types/select_option_response';

export const postInInstantwinSelectOptionApi = async (req: Request, res: Response): Promise<void> => {
  try {
    const selectOptionData: SelectOptionCreateRequest = req.body;

    const selectOption = await InInstantwinSelectOptionService.createSelectOption(selectOptionData);

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

    ResponseHelper.created(res, response, SELECT_OPTION_CONSTANTS.MESSAGES.SELECT_OPTION_CREATED);
  } catch (error) {
    console.error('Error in postInInstantwinSelectOptionApi:', error);
    
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
        ResponseHelper.internalServerError(res, '選択肢の作成に失敗しました');
      }
    } else {
      ResponseHelper.internalServerError(res, '選択肢の作成に失敗しました');
    }
  }
};