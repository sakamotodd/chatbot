import { Request, Response } from 'express';
import { InInstantwinMessageSelectOptionService } from '../../services/in_instantwin_select_option_service';
import { SelectOptionValidator } from './utils/select_option_validator';
import { SELECT_OPTION_CONSTANTS } from './utils/select_option_constants';
import { ResponseHelper } from '../../utils/response';

export const deleteInInstantwinSelectOptionApi = async (req: Request, res: Response): Promise<void> => {
  try {
    const { isValid, numericId, error } = SelectOptionValidator.validateId(req.params.id);
    
    if (!isValid || !numericId) {
      ResponseHelper.badRequest(res, error || '無効なIDです');
      return;
    }

    const deleted = await InInstantwinMessageSelectOptionService.deleteSelectOption(numericId);
    
    if (!deleted) {
      ResponseHelper.notFound(res, '選択肢が見つかりません');
      return;
    }

    ResponseHelper.success(res, null, SELECT_OPTION_CONSTANTS.MESSAGES.SELECT_OPTION_DELETED);
  } catch (error) {
    console.error('Error in deleteInInstantwinSelectOptionApi:', error);
    ResponseHelper.internalError(res, '選択肢の削除に失敗しました');
  }
};