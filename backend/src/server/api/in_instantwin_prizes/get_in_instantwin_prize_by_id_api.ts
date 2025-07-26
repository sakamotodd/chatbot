import { Request, Response, NextFunction } from 'express';
import { InInstantwinPrizeService } from '../../services/in_instantwin_prize_service';
import { ResponseHelper } from '../../utils/response';
import { PrizeValidator } from './utils/prize_validator';
import { PRIZE_CONSTANTS } from './utils/prize_constants';
import { PrizeQueryParams } from './types/prize_request';

export const getInInstantwinPrizeById = async (
  req: Request<
    { id: string },
    Record<string, never>,
    Record<string, never>,
    PrizeQueryParams
  >,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const idValidation = PrizeValidator.validateId(req.params.id);
    if (!idValidation.isValid) {
      ResponseHelper.badRequest(res, idValidation.error || '無効なプライズIDです');
      return;
    }

    const prizeId = idValidation.numericId!;
    const { includes } = PrizeValidator.validateQueryParams(req.query);

    const prize = await InInstantwinPrizeService.getPrizeById(prizeId, {
      include_templates: includes.templates,
      include_nodes: includes.nodes,
      include_messages: includes.messages,
    });

    const prizeData: any = {
      id: prize.id,
      campaign_id: prize.campaign_id,
      name: prize.name,
      description: prize.description,
      send_winner_count: prize.send_winner_count,
      winner_count: prize.winner_count,
      winning_rate_change_type: prize.winning_rate_change_type,
      winning_rate: parseFloat(prize.winning_rate.toString()),
      daily_winner_count: prize.daily_winner_count,
      is_daily_lottery: prize.is_daily_lottery,
      lottery_count_per_minute: prize.lottery_count_per_minute,
      lottery_count_per_minute_updated_datetime: prize.lottery_count_per_minute_updated_datetime,
      created: prize.created,
      modified: prize.modified,
    };

    // Add included relations
    const prizeWithRelations = prize as any;
    if (includes.templates && prizeWithRelations.templates) {
      prizeData.in_instantwin_templates = prizeWithRelations.templates;
    }
    if (includes.nodes && prizeWithRelations.nodes) {
      prizeData.in_instantwin_nodes = prizeWithRelations.nodes;
    }
    if (includes.messages && prizeWithRelations.messages) {
      prizeData.in_instantwin_messages = prizeWithRelations.messages;
    }

    const responseData = {
      in_instantwin_prize: prizeData,
    };

    ResponseHelper.success(res, responseData, PRIZE_CONSTANTS.MESSAGES.PRIZE_RETRIEVED);
  } catch (error: any) {
    if (error.statusCode === 404) {
      ResponseHelper.notFound(res, error.message, error.code);
      return;
    }
    next(error);
  }
};

export default getInInstantwinPrizeById;