// Prize API request types
export interface PrizeQueryParams {
  page?: number;
  limit?: number;
  include_templates?: boolean;
  include_nodes?: boolean;
  include_messages?: boolean;
}

export interface PrizeCreateRequest {
  name: string;
  description?: string;
  winner_count: number;
  winning_rate?: number;
  daily_winner_count?: number;
  is_daily_lottery?: boolean;
  lottery_count_per_minute?: number;
}

export interface PrizeUpdateRequest {
  name?: string;
  description?: string;
  winner_count?: number;
  winning_rate?: number;
  daily_winner_count?: number;
  is_daily_lottery?: boolean;
  lottery_count_per_minute?: number;
}

export interface PrizeDeleteParams {
  force?: string;
}