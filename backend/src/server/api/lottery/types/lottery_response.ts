// Lottery API response types
export interface LotteryExecuteResponse {
  lottery_result: {
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
    executed_at: Date;
  };
}

export interface LotteryValidationResponse {
  lottery_validation: {
    eligible: boolean;
    reason?: string;
    user_id: string;
    template_id: number;
    checked_at: Date;
  };
}