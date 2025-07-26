import { InInstantwinPrize } from '../models/in_instantwin_prizes';
import { InInstantwinLotteryHistory } from '../models/in_instantwin_lottery_histories';
import { InInstantwinConversation } from '../models/in_instantwin_conversations';
import logger from '../utils/logger';

export interface LotteryResult {
  is_winner: boolean;
  prize_id?: number;
  prize?: {
    id: number;
    name: string;
    type: number;
    description?: string;
    value?: number;
    image_url?: string;
  };
  lottery_id: number;
  probability_used: number;
  random_value: number;
  message: string;
}

export interface LotteryOptions {
  user_id: string;
  conversation_id: number;
  template_id?: number;
  exclude_prize_ids?: number[];
  custom_weights?: { [prize_id: number]: number };
}

export class LotteryEngineService {
  /**
   * Execute lottery for a user
   */
  static async executeLottery(options: LotteryOptions): Promise<LotteryResult> {
    const { user_id, conversation_id, template_id, exclude_prize_ids = [], custom_weights = {} } = options;

    try {
      // Get conversation to determine template if not provided
      const conversation = await InInstantwinConversation.findByPk(conversation_id);
      if (!conversation) {
        throw new Error('Conversation not found');
      }

      const finalTemplateId = template_id || conversation.template_id;

      // Get available prizes for the template
      const availablePrizes = await this.getAvailablePrizes(finalTemplateId, exclude_prize_ids);

      if (availablePrizes.length === 0) {
        return this.createLossResult(user_id, conversation_id, 'プライズがありません');
      }

      // Calculate winning probability and select prize
      const result = await this.calculateAndSelectPrize(availablePrizes, custom_weights);
      
      // Record lottery attempt
      const lotteryHistory = await InInstantwinLotteryHistory.create({
        user_id,
        conversation_id,
        template_id: finalTemplateId,
        prize_id: result.prize_id,
        is_winner: result.is_winner,
        probability: result.probability_used,
        random_value: result.random_value,
        executed_at: new Date(),
      });

      return {
        ...result,
        lottery_id: lotteryHistory.id,
      };

    } catch (error) {
      logger.error('Error in executeLottery:', error);
      
      // Record failed lottery attempt
      const lotteryHistory = await InInstantwinLotteryHistory.create({
        user_id,
        conversation_id,
        template_id: template_id || 0,
        is_winner: false,
        probability: 0,
        random_value: 0,
        executed_at: new Date(),
        error_message: error instanceof Error ? error.message : 'Unknown error',
      });

      return {
        is_winner: false,
        lottery_id: lotteryHistory.id,
        probability_used: 0,
        random_value: 0,
        message: '抽選処理でエラーが発生しました',
      };
    }
  }

  /**
   * Calculate win probability based on multiple factors
   */
  static async calculateWinProbability(
    prizes: InInstantwinPrize[], 
    userId: string, 
    templateId: number,
    customWeights: { [prize_id: number]: number } = {}
  ): Promise<{ [prize_id: number]: number }> {
    const probabilities: { [prize_id: number]: number } = {};

    for (const prize of prizes) {
      let baseProbability = prize.win_probability;

      // Apply custom weights if provided
      if (customWeights[prize.id]) {
        baseProbability *= customWeights[prize.id];
      }

      // Factor in prize value (higher value = lower probability)
      if (prize.value && prize.value > 0) {
        const valueFactor = Math.max(0.1, 1 / (1 + prize.value / 1000)); // Scale down for high-value prizes
        baseProbability *= valueFactor;
      }

      // Factor in inventory (if stock-limited)
      if (prize.stock_quantity !== null && prize.stock_quantity !== undefined) {
        if (prize.stock_quantity <= 0) {
          baseProbability = 0; // No stock = no chance
        } else if (prize.stock_quantity < 10) {
          baseProbability *= 0.5; // Low stock = reduced chance
        }
      }

      // Factor in user's recent win history (anti-fraud)
      const recentWins = await this.getUserRecentWins(userId, templateId, 24); // Last 24 hours
      if (recentWins >= 3) {
        baseProbability *= 0.1; // Significantly reduce chance for frequent winners
      } else if (recentWins >= 1) {
        baseProbability *= 0.5; // Moderately reduce chance
      }

      // Factor in daily limits
      const todayWins = await this.getUserTodayWins(userId, templateId);
      const dailyLimit = prize.daily_limit || 1;
      if (todayWins >= dailyLimit) {
        baseProbability = 0; // Exceeded daily limit
      }

      probabilities[prize.id] = Math.max(0, Math.min(1, baseProbability)); // Clamp between 0 and 1
    }

    return probabilities;
  }

  /**
   * Select prize based on calculated probabilities
   */
  private static async calculateAndSelectPrize(
    prizes: InInstantwinPrize[],
    customWeights: { [prize_id: number]: number } = {}
  ): Promise<Omit<LotteryResult, 'lottery_id'>> {
    // Calculate probabilities for all prizes
    const probabilities = await this.calculateWinProbability(
      prizes, 
      '', // userId not needed for this calculation
      0,  // templateId not needed for this calculation
      customWeights
    );

    // Generate random number
    const randomValue = Math.random();

    // Create cumulative probability ranges
    const ranges: { prize: InInstantwinPrize; min: number; max: number; probability: number }[] = [];
    let cumulative = 0;

    for (const prize of prizes) {
      const probability = probabilities[prize.id] || 0;
      const min = cumulative;
      const max = cumulative + probability;
      
      ranges.push({
        prize,
        min,
        max,
        probability,
      });
      
      cumulative = max;
    }

    // Normalize to ensure total probability doesn't exceed 1
    if (cumulative > 1) {
      ranges.forEach(range => {
        range.max = range.max / cumulative;
        range.min = range.min / cumulative;
        range.probability = range.probability / cumulative;
      });
      cumulative = 1;
    }

    // Find winning prize
    for (const range of ranges) {
      if (randomValue >= range.min && randomValue < range.max) {
        return {
          is_winner: true,
          prize_id: range.prize.id,
          prize: {
            id: range.prize.id,
            name: range.prize.name,
            type: range.prize.type,
            description: range.prize.description,
            value: range.prize.value,
            image_url: range.prize.image_url,
          },
          probability_used: range.probability,
          random_value: randomValue,
          message: `おめでとうございます！${range.prize.name}に当選しました！`,
        };
      }
    }

    // No win
    return {
      is_winner: false,
      probability_used: cumulative,
      random_value: randomValue,
      message: '残念！今回は当選しませんでした。',
    };
  }

  /**
   * Get available prizes for a template
   */
  private static async getAvailablePrizes(
    templateId: number, 
    excludePrizeIds: number[] = []
  ): Promise<InInstantwinPrize[]> {
    const whereClause: any = {
      template_id: templateId,
      is_active: true,
    };

    if (excludePrizeIds.length > 0) {
      whereClause.id = { [Op.notIn]: excludePrizeIds };
    }

    return InInstantwinPrize.findAll({
      where: whereClause,
      order: [['win_probability', 'DESC']],
    });
  }

  /**
   * Get user's recent wins count
   */
  private static async getUserRecentWins(userId: string, templateId: number, hoursBack: number): Promise<number> {
    const since = new Date();
    since.setHours(since.getHours() - hoursBack);

    const count = await InInstantwinLotteryHistory.count({
      where: {
        user_id: userId,
        template_id: templateId,
        is_winner: true,
        executed_at: {
          [Op.gte]: since,
        },
      },
    });

    return count;
  }

  /**
   * Get user's wins today
   */
  private static async getUserTodayWins(userId: string, templateId: number): Promise<number> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const count = await InInstantwinLotteryHistory.count({
      where: {
        user_id: userId,
        template_id: templateId,
        is_winner: true,
        executed_at: {
          [Op.gte]: today,
          [Op.lt]: tomorrow,
        },
      },
    });

    return count;
  }

  /**
   * Create a loss result
   */
  private static createLossResult(userId: string, conversationId: number, message: string): LotteryResult {
    return {
      is_winner: false,
      lottery_id: 0,
      probability_used: 0,
      random_value: 0,
      message,
    };
  }

  /**
   * Validate lottery eligibility
   */
  static async validateLotteryEligibility(userId: string, templateId: number): Promise<{ eligible: boolean; reason?: string }> {
    // Check daily limits
    const todayWins = await this.getUserTodayWins(userId, templateId);
    const maxDailyWins = 5; // Global daily limit
    
    if (todayWins >= maxDailyWins) {
      return {
        eligible: false,
        reason: '本日の抽選回数上限に達しています',
      };
    }

    // Check recent frequency
    const recentWins = await this.getUserRecentWins(userId, templateId, 1); // Last hour
    if (recentWins >= 2) {
      return {
        eligible: false,
        reason: '抽選間隔が短すぎます。しばらく待ってからお試しください',
      };
    }

    return { eligible: true };
  }
}

// Add missing import
const { Op } = require('sequelize');