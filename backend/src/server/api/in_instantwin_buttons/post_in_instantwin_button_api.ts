import { Request, Response } from 'express';
import { InInstantwinButtonService } from '../../services/in_instantwin_button_service';
import { BUTTON_CONSTANTS } from './utils/button_constants';
import { ResponseHelper } from '../response_helper';
import { ButtonCreateRequest } from './types/button_request';
import { ButtonDetailResponse } from './types/button_response';

export const postInInstantwinButtonApi = async (req: Request, res: Response): Promise<void> => {
  try {
    const buttonData: ButtonCreateRequest = req.body;

    const button = await InInstantwinButtonService.createButton(buttonData);

    const response: ButtonDetailResponse = {
      in_instantwin_button: {
        id: button.id,
        card_id: button.card_id,
        text: button.text,
        type: button.type,
        value: button.value,
        url: button.url,
        step_order: button.step_order,
        created: button.created,
        modified: button.modified,
      },
    };

    ResponseHelper.created(res, response, BUTTON_CONSTANTS.MESSAGES.BUTTON_CREATED);
  } catch (error) {
    console.error('Error in postInInstantwinButtonApi:', error);
    
    if (error instanceof Error) {
      if (error.message.startsWith(BUTTON_CONSTANTS.ERROR_CODES.VALIDATION_ERROR)) {
        ResponseHelper.badRequest(res, error.message);
      } else if (error.message.startsWith(BUTTON_CONSTANTS.ERROR_CODES.CARD_NOT_FOUND)) {
        ResponseHelper.notFound(res, 'カードが見つかりません');
      } else if (error.message.startsWith(BUTTON_CONSTANTS.ERROR_CODES.DUPLICATE_STEP_ORDER)) {
        ResponseHelper.badRequest(res, 'このステップ順序は既に使用されています');
      } else {
        ResponseHelper.internalServerError(res, 'ボタンの作成に失敗しました');
      }
    } else {
      ResponseHelper.internalServerError(res, 'ボタンの作成に失敗しました');
    }
  }
};