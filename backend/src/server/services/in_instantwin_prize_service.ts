import { InInstantwinPrize, InInstantwinPrizeCreationAttributes } from '../../../database/models/in_instantwin_prizes';
import { InInstantwinTemplate, TemplateType } from '../../../database/models/in_instantwin_templates';
import { InInstantwinNode } from '../../../database/models/in_instantwin_nodes';
import { InInstantwinMessage } from '../../../database/models/in_instantwin_messages';
import { InInstantwinConversation } from '../../../database/models/in_instantwin_conversations';
import { Campaign } from '../../../database/models/campaigns';
import { Op } from 'sequelize';
import logger from '../utils/logger';
import { PRIZE_CONSTANTS } from '../api/in_instantwin_prizes/utils/prize_constants';
import { PrizeEntity, PrizeWithRelations, PaginationInfo, DeleteResult } from '../api/in_instantwin_prizes/types/prize_entities';
import { PrizeCreateRequest, PrizeUpdateRequest } from '../api/in_instantwin_prizes/types/prize_request';

export class InInstantwinPrizeService {
  static async getAllPrizes(campaignId: number, options: {
    page?: number;
    limit?: number;
    include_templates?: boolean;
    include_nodes?: boolean;
    include_messages?: boolean;
  }) {
    const {
      page = 1,
      limit = PRIZE_CONSTANTS.DEFAULT_PAGE_SIZE,
      include_templates = true,
      include_nodes = false,
      include_messages = false,
    } = options;

    const offset = (page - 1) * limit;

    try {
      // First verify campaign exists
      const campaign = await Campaign.findByPk(campaignId);
      if (!campaign) {
        const error = new Error('指定されたキャンペーンが見つかりません') as any;
        error.statusCode = 404;
        error.code = PRIZE_CONSTANTS.ERROR_CODES.CAMPAIGN_NOT_FOUND;
        throw error;
      }

      // Build include options
      const includeOptions: any[] = [];
      
      if (include_templates) {
        includeOptions.push({
          model: InInstantwinTemplate,
          as: 'templates',
          attributes: ['id', 'prize_id', 'name', 'type', 'step_order', 'is_active', 'created', 'modified'],
          order: [['step_order', 'ASC']],
        });
      }

      if (include_nodes) {
        includeOptions.push({
          model: InInstantwinNode,
          as: 'nodes',
          attributes: ['id', 'template_id', 'prize_id', 'type', 'created', 'modified'],
        });
      }

      if (include_messages) {
        includeOptions.push({
          model: InInstantwinMessage,
          as: 'messages',
          attributes: ['id', 'node_id', 'prize_id', 'text', 'created', 'modified'],
        });
      }

      const { count, rows } = await InInstantwinPrize.findAndCountAll({
        where: { campaign_id: campaignId },
        include: includeOptions,
        order: [['created', 'DESC']],
        limit,
        offset,
      });

      const pagination: PaginationInfo = {
        current_page: page,
        total_pages: Math.ceil(count / limit),
        total_count: count,
        per_page: limit,
        has_next: page < Math.ceil(count / limit),
        has_prev: page > 1,
      };

      return {
        prizes: rows,
        pagination,
      };
    } catch (error) {
      logger.error('プライズ一覧取得エラー:', error);
      throw error;
    }
  }

  static async getPrizeById(id: number, options: {
    include_templates?: boolean;
    include_nodes?: boolean;
    include_messages?: boolean;
  }) {
    const {
      include_templates = true,
      include_nodes = false,
      include_messages = false,
    } = options;

    try {
      // Build include options
      const includeOptions: any[] = [];
      
      if (include_templates) {
        includeOptions.push({
          model: InInstantwinTemplate,
          as: 'templates',
          attributes: ['id', 'prize_id', 'name', 'type', 'step_order', 'is_active', 'created', 'modified'],
          order: [['step_order', 'ASC']],
        });
      }

      if (include_nodes) {
        includeOptions.push({
          model: InInstantwinNode,
          as: 'nodes',
          attributes: ['id', 'template_id', 'prize_id', 'type', 'created', 'modified'],
        });
      }

      if (include_messages) {
        includeOptions.push({
          model: InInstantwinMessage,
          as: 'messages',
          attributes: ['id', 'node_id', 'prize_id', 'text', 'created', 'modified'],
        });
      }

      const prize = await InInstantwinPrize.findByPk(id, {
        include: includeOptions,
      });

      if (!prize) {
        const error = new Error('指定されたプライズが見つかりません') as any;
        error.statusCode = 404;
        error.code = PRIZE_CONSTANTS.ERROR_CODES.PRIZE_NOT_FOUND;
        throw error;
      }

      return prize;
    } catch (error) {
      logger.error('プライズ詳細取得エラー:', error);
      throw error;
    }
  }

  static async createPrize(campaignId: number, prizeData: PrizeCreateRequest) {
    try {
      // Verify campaign exists
      const campaign = await Campaign.findByPk(campaignId);
      if (!campaign) {
        const error = new Error('指定されたキャンペーンが見つかりません') as any;
        error.statusCode = 404;
        error.code = PRIZE_CONSTANTS.ERROR_CODES.CAMPAIGN_NOT_FOUND;
        throw error;
      }

      // Prepare prize creation data
      const prizeCreationData: InInstantwinPrizeCreationAttributes = {
        campaign_id: campaignId,
        name: prizeData.name,
        description: prizeData.description,
        send_winner_count: PRIZE_CONSTANTS.DEFAULT_SEND_WINNER_COUNT,
        winner_count: prizeData.winner_count,
        winning_rate_change_type: PRIZE_CONSTANTS.DEFAULT_WINNING_RATE_CHANGE_TYPE,
        winning_rate: prizeData.winning_rate || PRIZE_CONSTANTS.DEFAULT_WINNING_RATE,
        daily_winner_count: prizeData.daily_winner_count,
        is_daily_lottery: prizeData.is_daily_lottery || PRIZE_CONSTANTS.DEFAULT_IS_DAILY_LOTTERY,
        lottery_count_per_minute: prizeData.lottery_count_per_minute,
        lottery_count_per_minute_updated_datetime: prizeData.lottery_count_per_minute ? new Date() : undefined,
      };

      // Create prize
      const prize = await InInstantwinPrize.create(prizeCreationData);

      // Create default templates
      const templatePromises = PRIZE_CONSTANTS.DEFAULT_TEMPLATES.map(template => 
        InInstantwinTemplate.create({
          prize_id: prize.id,
          name: template.name,
          type: template.type as TemplateType,
          step_order: template.step_order,
          is_active: true,
        })
      );

      await Promise.all(templatePromises);

      logger.info('プライズが作成されました:', {
        id: prize.id,
        name: prize.name,
        campaign_id: campaignId,
      });

      return prize;
    } catch (error) {
      logger.error('プライズ作成エラー:', error);
      throw error;
    }
  }

  static async updatePrize(id: number, updateData: PrizeUpdateRequest) {
    try {
      const prize = await InInstantwinPrize.findByPk(id);

      if (!prize) {
        const error = new Error('指定されたプライズが見つかりません') as any;
        error.statusCode = 404;
        error.code = PRIZE_CONSTANTS.ERROR_CODES.PRIZE_NOT_FOUND;
        throw error;
      }

      // Check winner count constraint
      if (updateData.winner_count !== undefined && updateData.winner_count < prize.send_winner_count) {
        const error = new Error('当選者数は現在の当選者数より小さくできません') as any;
        error.statusCode = 409;
        error.code = PRIZE_CONSTANTS.ERROR_CODES.PRIZE_UPDATE_CONFLICT;
        error.details = {
          current_winner_count: prize.winner_count,
          send_winner_count: prize.send_winner_count,
          attempted_winner_count: updateData.winner_count,
        };
        throw error;
      }

      // Prepare update data
      const updateFields: any = {};
      
      if (updateData.name !== undefined) updateFields.name = updateData.name;
      if (updateData.description !== undefined) updateFields.description = updateData.description;
      if (updateData.winner_count !== undefined) updateFields.winner_count = updateData.winner_count;
      if (updateData.winning_rate !== undefined) updateFields.winning_rate = updateData.winning_rate;
      if (updateData.daily_winner_count !== undefined) updateFields.daily_winner_count = updateData.daily_winner_count;
      if (updateData.is_daily_lottery !== undefined) updateFields.is_daily_lottery = updateData.is_daily_lottery;
      if (updateData.lottery_count_per_minute !== undefined) {
        updateFields.lottery_count_per_minute = updateData.lottery_count_per_minute;
        updateFields.lottery_count_per_minute_updated_datetime = new Date();
      }

      await prize.update(updateFields);

      logger.info('プライズが更新されました:', {
        id,
        name: prize.name,
      });

      return prize;
    } catch (error) {
      logger.error('プライズ更新エラー:', error);
      throw error;
    }
  }

  static async deletePrize(id: number, force: boolean = false): Promise<DeleteResult> {
    try {
      const prize = await InInstantwinPrize.findByPk(id);

      if (!prize) {
        const error = new Error('指定されたプライズが見つかりません') as any;
        error.statusCode = 404;
        error.code = PRIZE_CONSTANTS.ERROR_CODES.PRIZE_NOT_FOUND;
        throw error;
      }

      // Check for active conversations unless force delete
      if (!force) {
        const activeConversations = await InInstantwinConversation.count({
          where: {
            prize_id: id,
            session_data: { [Op.ne]: null },
          },
        });

        if (activeConversations > 0) {
          const error = new Error('進行中の会話があるため削除できません') as any;
          error.statusCode = 409;
          error.code = PRIZE_CONSTANTS.ERROR_CODES.PRIZE_DELETE_CONFLICT;
          error.details = {
            prize_id: id,
            active_conversations: activeConversations,
            suggestion: '進行中の会話を終了してから削除するか、force=trueパラメータを使用してください',
          };
          throw error;
        }
      }

      // Count related data before deletion
      const templatesCount = await InInstantwinTemplate.count({ where: { prize_id: id } });
      const nodesCount = await InInstantwinNode.count({ where: { prize_id: id } });
      const messagesCount = await InInstantwinMessage.count({ where: { prize_id: id } });
      const conversationsCount = await InInstantwinConversation.count({ where: { prize_id: id } });

      // Delete related data in correct order
      await InInstantwinConversation.destroy({ where: { prize_id: id } });
      await InInstantwinMessage.destroy({ where: { prize_id: id } });
      await InInstantwinNode.destroy({ where: { prize_id: id } });
      await InInstantwinTemplate.destroy({ where: { prize_id: id } });

      // Delete the prize
      await prize.destroy();

      logger.info('プライズが削除されました:', {
        id,
        name: prize.name,
        related_data: { templatesCount, nodesCount, messagesCount, conversationsCount },
      });

      return {
        templates: templatesCount,
        nodes: nodesCount,
        messages: messagesCount,
        conversations: conversationsCount,
      };
    } catch (error) {
      logger.error('プライズ削除エラー:', error);
      throw error;
    }
  }

  static async getPrizeStatistics(prizeId: number) {
    try {
      const prize = await InInstantwinPrize.findByPk(prizeId);
      if (!prize) {
        const error = new Error('指定されたプライズが見つかりません') as any;
        error.statusCode = 404;
        error.code = PRIZE_CONSTANTS.ERROR_CODES.PRIZE_NOT_FOUND;
        throw error;
      }

      // Get template statistics
      const templatesCount = await InInstantwinTemplate.count({
        where: { prize_id: prizeId }
      });

      // Get node statistics
      const nodesCount = await InInstantwinNode.count({
        where: { prize_id: prizeId }
      });

      // Get message statistics
      const messagesCount = await InInstantwinMessage.count({
        where: { prize_id: prizeId }
      });

      // Get conversation statistics
      const conversationStats = await InInstantwinConversation.findAll({
        where: { prize_id: prizeId },
        attributes: [
          [InInstantwinConversation.sequelize!.fn('COUNT', InInstantwinConversation.sequelize!.col('id')), 'total_conversations'],
          [InInstantwinConversation.sequelize!.fn('COUNT', InInstantwinConversation.sequelize!.literal('CASE WHEN status = 0 THEN 1 END')), 'active_conversations'],
          [InInstantwinConversation.sequelize!.fn('COUNT', InInstantwinConversation.sequelize!.literal('CASE WHEN status = 1 THEN 1 END')), 'completed_conversations'],
          [InInstantwinConversation.sequelize!.fn('COUNT', InInstantwinConversation.sequelize!.literal('CASE WHEN won_prize = true THEN 1 END')), 'winning_conversations'],
        ],
        raw: true,
      });

      const conversationData = conversationStats[0] as any;

      // Calculate lottery statistics
      const lotteryStats = {
        total_attempts: parseInt(conversationData.total_conversations || '0'),
        total_winners: parseInt(conversationData.winning_conversations || '0'),
        current_winning_rate: 0,
        remaining_winners: Math.max(0, prize.winner_count - prize.send_winner_count),
      };

      if (lotteryStats.total_attempts > 0) {
        lotteryStats.current_winning_rate = (lotteryStats.total_winners / lotteryStats.total_attempts) * 100;
      }

      // Get daily statistics for today
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const dailyStats = await InInstantwinConversation.findAll({
        where: {
          prize_id: prizeId,
          created: {
            [Op.gte]: today,
            [Op.lt]: tomorrow,
          },
        },
        attributes: [
          [InInstantwinConversation.sequelize!.fn('COUNT', InInstantwinConversation.sequelize!.col('id')), 'daily_conversations'],
          [InInstantwinConversation.sequelize!.fn('COUNT', InInstantwinConversation.sequelize!.literal('CASE WHEN won_prize = true THEN 1 END')), 'daily_winners'],
        ],
        raw: true,
      });

      const dailyData = dailyStats[0] as any;

      return {
        prize_info: {
          id: prize.id,
          name: prize.name,
          total_winner_count: prize.winner_count,
          current_winner_count: prize.send_winner_count,
          winning_rate: parseFloat(prize.winning_rate.toString()),
          daily_winner_count: prize.daily_winner_count,
          is_daily_lottery: prize.is_daily_lottery,
        },
        templates: {
          total_count: templatesCount,
        },
        flow: {
          nodes_count: nodesCount,
          messages_count: messagesCount,
        },
        conversations: {
          total: parseInt(conversationData.total_conversations || '0'),
          active: parseInt(conversationData.active_conversations || '0'),
          completed: parseInt(conversationData.completed_conversations || '0'),
        },
        lottery: lotteryStats,
        daily: {
          conversations: parseInt(dailyData.daily_conversations || '0'),
          winners: parseInt(dailyData.daily_winners || '0'),
          remaining_daily_winners: Math.max(0, prize.daily_winner_count - parseInt(dailyData.daily_winners || '0')),
        },
      };
    } catch (error) {
      logger.error('プライズ統計情報取得エラー:', error);
      throw error;
    }
  }
}

export default InInstantwinPrizeService;