import {
  Campaign,
  CampaignAttributes,
  CampaignCreationAttributes,
} from '../../../database/models/campaigns';
import { InInstantwinPrize } from '../../../database/models/in_instantwin_prizes';
import { Op } from 'sequelize';
import logger from '../utils/logger';

export class CampaignService {
  static async getCampaigns(options: {
    page?: number;
    limit?: number;
    status?: string;
    sort?: string;
  }) {
    const {
      page = 1,
      limit = 10,
      status,
      sort = 'created_desc',
    } = options;

    const offset = (page - 1) * limit;
    const where: any = {};

    // Status filter
    if (status) {
      where.status = status;
    }

    // Sort parsing
    let sortBy = 'created';
    let sortOrder: 'ASC' | 'DESC' = 'DESC';
    
    if (sort) {
      const sortParts = sort.split('_');
      if (sortParts.length === 2) {
        sortBy = sortParts[0];
        sortOrder = sortParts[1].toUpperCase() as 'ASC' | 'DESC';
      }
    }

    try {
      const { count, rows } = await Campaign.findAndCountAll({
        where,
        attributes: ['id', 'title', 'description', 'status', 'start_date', 'end_date', 'created', 'modified'],
        order: [[sortBy, sortOrder]],
        limit,
        offset,
      });

      return {
        campaigns: rows,
        pagination: {
          page,
          limit,
          total: count,
          totalPages: Math.ceil(count / limit),
        },
      };
    } catch (error) {
      logger.error('キャンペーン一覧取得エラー:', error);
      throw error;
    }
  }

  static async getCampaignById(id: number) {
    try {
      const campaign = await Campaign.findByPk(id, {
        attributes: ['id', 'title', 'description', 'status', 'start_date', 'end_date', 'created', 'modified'],
      });

      if (!campaign) {
        const error = new Error('キャンペーンが見つかりません') as any;
        error.statusCode = 404;
        throw error;
      }

      return campaign;
    } catch (error) {
      logger.error('キャンペーン詳細取得エラー:', error);
      throw error;
    }
  }

  static async createCampaign(campaignData: CampaignCreationAttributes) {
    try {
      const campaign = await Campaign.create(campaignData);
      logger.info('キャンペーンが作成されました:', {
        id: campaign.id,
        title: campaign.title,
      });
      return campaign;
    } catch (error) {
      logger.error('キャンペーン作成エラー:', error);
      throw error;
    }
  }

  static async updateCampaign(
    id: number,
    updateData: Partial<CampaignAttributes>
  ) {
    try {
      const campaign = await Campaign.findByPk(id);

      if (!campaign) {
        const error = new Error('キャンペーンが見つかりません') as any;
        error.statusCode = 404;
        throw error;
      }

      await campaign.update(updateData);
      logger.info('キャンペーンが更新されました:', {
        id,
        title: campaign.title,
      });

      return campaign;
    } catch (error) {
      logger.error('キャンペーン更新エラー:', error);
      throw error;
    }
  }

  static async deleteCampaign(id: number) {
    try {
      const campaign = await Campaign.findByPk(id);

      if (!campaign) {
        const error = new Error('キャンペーンが見つかりません') as any;
        error.statusCode = 404;
        throw error;
      }

      await campaign.destroy();
      logger.info('キャンペーンが削除されました:', {
        id,
        title: campaign.title,
      });

      return true;
    } catch (error) {
      logger.error('キャンペーン削除エラー:', error);
      throw error;
    }
  }

  static async getCampaignStats(id: number) {
    try {
      const campaign = await Campaign.findByPk(id, {
        include: [
          {
            model: InInstantwinPrize,
            as: 'prizes',
          },
        ],
      });

      if (!campaign) {
        const error = new Error('キャンペーンが見つかりません') as any;
        error.statusCode = 404;
        throw error;
      }

      // Cast to any to access association properties
      const campaignWithPrizes = campaign as any;
      const prizes = campaignWithPrizes.prizes || [];

      // Calculate basic stats
      const stats = {
        totalPrizes: prizes.length,
        totalWinners: prizes.reduce(
          (sum: number, prize: any) => sum + prize.winner_count,
          0
        ),
        averageWinningRate:
          prizes.length > 0
            ? prizes.reduce(
                (sum: number, prize: any) =>
                  sum + parseFloat(prize.winning_rate.toString()),
                0
              ) / prizes.length
            : 0,
      };

      return {
        campaign,
        stats,
      };
    } catch (error) {
      logger.error('キャンペーン統計取得エラー:', error);
      throw error;
    }
  }
}

export default CampaignService;
