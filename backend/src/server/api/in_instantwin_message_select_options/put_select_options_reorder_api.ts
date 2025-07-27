import { Request, Response } from 'express';
import { InInstantwinMessageSelectOptionService } from '../../services/in_instantwin_select_option_service';
import { SelectOptionValidator } from './utils/select_option_validator';
import { SELECT_OPTION_CONSTANTS } from './utils/select_option_constants';
import { ResponseHelper } from '../../utils/response';
import { SelectOptionResponse } from './types/select_option_response';

interface ReorderRequest {
  message_id: number;
  option_orders: { id: number; step_order: number }[];
}

export const putSelectOptionsReorderApi = async (req: Request, res: Response): Promise<void> => {
  try {
    const { message_id, option_orders }: ReorderRequest = req.body;

    if (!message_id || message_id <= 0) {
      ResponseHelper.badRequest(res, 'メッセージIDは必須です');
      return;
    }

    if (!Array.isArray(option_orders) || option_orders.length === 0) {
      ResponseHelper.badRequest(res, '選択肢順序配列は必須です');
      return;
    }

    // Validate option order entries
    for (const order of option_orders) {
      if (!order.id || order.id <= 0 || !Number.isInteger(order.id)) {
        ResponseHelper.badRequest(res, '無効な選択肢IDです');
        return;
      }
      if (order.step_order === undefined || order.step_order < 0 || !Number.isInteger(order.step_order)) {
        ResponseHelper.badRequest(res, '無効なステップ順序です');
        return;
      }
    }

    const selectOptions = await InInstantwinMessageSelectOptionService.reorderSelectOptions(message_id, option_orders);

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

    ResponseHelper.success(res, response, '選択肢の順序が正常に更新されました');
  } catch (error) {
    console.error('Error in putSelectOptionsReorderApi:', error);
    
    if (error instanceof Error) {
      if (error.message.startsWith(SELECT_OPTION_CONSTANTS.ERROR_CODES.MESSAGE_NOT_FOUND)) {
        ResponseHelper.notFound(res, 'メッセージが見つかりません');
      } else if (error.message.startsWith(SELECT_OPTION_CONSTANTS.ERROR_CODES.SELECT_OPTION_NOT_FOUND)) {
        ResponseHelper.notFound(res, '選択肢が見つかりません');
      } else {
        ResponseHelper.internalError(res, '選択肢の順序更新に失敗しました');
      }
    } else {
      ResponseHelper.internalError(res, '選択肢の順序更新に失敗しました');
    }
  }
};