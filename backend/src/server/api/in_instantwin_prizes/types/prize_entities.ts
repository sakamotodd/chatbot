// Prize entity types for internal processing
export interface PrizeEntity {
  id: number;
  campaign_id: number;
  name: string;
  description?: string;
  send_winner_count: number;
  winner_count: number;
  winning_rate_change_type: number;
  winning_rate: number;
  daily_winner_count?: number;
  is_daily_lottery: boolean;
  lottery_count_per_minute?: number;
  lottery_count_per_minute_updated_datetime?: Date;
  created: Date;
  modified: Date;
}

export interface PrizeWithTemplates extends PrizeEntity {
  templates: TemplateEntity[];
}

export interface PrizeWithRelations extends PrizeEntity {
  templates?: TemplateEntity[];
  nodes?: NodeEntity[];
  messages?: MessageEntity[];
}

export interface TemplateEntity {
  id: number;
  prize_id: number;
  name?: string;
  type: number;
  step_order: number;
  is_active: boolean;
  created: Date;
  modified: Date;
}

export interface NodeEntity {
  id: number;
  template_id?: number;
  prize_id: number;
  type: string;
  created: Date;
  modified: Date;
}

export interface MessageEntity {
  id: number;
  node_id?: number;
  prize_id: number;
  text?: string;
  created: Date;
  modified: Date;
}

export interface PaginationInfo {
  current_page: number;
  total_pages: number;
  total_count: number;
  per_page: number;
  has_next: boolean;
  has_prev: boolean;
}

export interface DeleteResult {
  templates: number;
  nodes: number;
  messages: number;
  conversations: number;
}