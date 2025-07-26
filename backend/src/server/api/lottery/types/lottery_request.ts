// Lottery API request types
export interface LotteryExecuteRequest {
  user_id: string;
  conversation_id: number;
  template_id?: number;
  exclude_prize_ids?: number[];
  custom_weights?: { [prize_id: number]: number };
}

export interface LotteryValidationRequest {
  user_id: string;
  template_id: number;
}