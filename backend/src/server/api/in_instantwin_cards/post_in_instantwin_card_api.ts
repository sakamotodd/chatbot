import { Request, Response } from 'express';
import { InInstantwinCardService } from '../../services/in_instantwin_card_service';
import { CARD_CONSTANTS } from './utils/card_constants';
import { ResponseHelper } from '../response_helper';
import { CardCreateRequest } from './types/card_request';
import { CardDetailResponse } from './types/card_response';

export const postInInstantwinCardApi = async (req: Request, res: Response): Promise<void> => {
  try {
    const cardData: CardCreateRequest = req.body;

    const card = await InInstantwinCardService.createCard(cardData);

    const response: CardDetailResponse = {
      in_instantwin_card: {
        id: card.id,
        message_id: card.message_id,
        title: card.title,
        subtitle: card.subtitle,
        image_url: card.image_url,
        url: card.url,
        step_order: card.step_order,
        created: card.created,
        modified: card.modified,
      },
    };

    ResponseHelper.created(res, response, CARD_CONSTANTS.MESSAGES.CARD_CREATED);
  } catch (error) {
    console.error('Error in postInInstantwinCardApi:', error);
    
    if (error instanceof Error) {
      if (error.message.startsWith(CARD_CONSTANTS.ERROR_CODES.VALIDATION_ERROR)) {
        ResponseHelper.badRequest(res, error.message);
      } else if (error.message.startsWith(CARD_CONSTANTS.ERROR_CODES.MESSAGE_NOT_FOUND)) {
        ResponseHelper.notFound(res, 'メッセージが見つかりません');
      } else if (error.message.startsWith(CARD_CONSTANTS.ERROR_CODES.DUPLICATE_STEP_ORDER)) {
        ResponseHelper.badRequest(res, 'このステップ順序は既に使用されています');
      } else {
        ResponseHelper.internalServerError(res, 'カードの作成に失敗しました');
      }
    } else {
      ResponseHelper.internalServerError(res, 'カードの作成に失敗しました');
    }
  }
};