// Campaign Types
export interface Campaign {
  id: number
  name: string
  description: string
  start_date: string
  end_date: string
  status: CampaignStatus
  is_active: boolean
  created: string
  modified: string
  in_instantwin_prizes?: Prize[]
}

export interface CampaignCreateRequest {
  name: string
  description: string
  start_date: string
  end_date: string
}

export interface CampaignUpdateRequest {
  name?: string
  description?: string
  start_date?: string
  end_date?: string
  status?: CampaignStatus
}

export enum CampaignStatus {
  DRAFT = 0,
  ACTIVE = 1,
  PAUSED = 2,
  COMPLETED = 3,
  CANCELLED = 4,
}

// Prize Types
export interface Prize {
  id: number
  campaign_id: number
  name: string
  description: string
  send_winner_count: number
  winner_count: number
  winning_rate_change_type: number
  winning_rate: number
  daily_winner_count: number
  is_daily_lottery: boolean
  lottery_count_per_minute: number
  lottery_count_per_minute_updated_datetime: string | null
  created: string
  modified: string
  in_instantwin_templates?: Template[]
}

export interface PrizeCreateRequest {
  name: string
  description: string
  winner_count: number
  winning_rate: number
  daily_winner_count: number
  is_daily_lottery: boolean
  lottery_count_per_minute: number
}

export interface PrizeUpdateRequest {
  name?: string
  description?: string
  winner_count?: number
  winning_rate?: number
  daily_winner_count?: number
  is_daily_lottery?: boolean
  lottery_count_per_minute?: number
}

export interface PrizeStatistics {
  prize_info: {
    id: number
    name: string
    total_winner_count: number
    current_winner_count: number
    winning_rate: number
    daily_winner_count: number
    is_daily_lottery: boolean
  }
  templates: {
    total_count: number
  }
  flow: {
    nodes_count: number
    messages_count: number
  }
  conversations: {
    total: number
    active: number
    completed: number
  }
  lottery: {
    total_attempts: number
    total_winners: number
    current_winning_rate: number
    remaining_winners: number
  }
  daily: {
    conversations: number
    winners: number
    remaining_daily_winners: number
  }
}

// Template Types
export interface Template {
  id: number
  prize_id: number
  name: string
  type: TemplateType
  step_order: number
  is_active: boolean
  created: string
  modified: string
  in_instantwin_nodes?: Node[]
}

export interface TemplateCreateRequest {
  name: string
  type: string
  step_order?: number
}

export interface TemplateUpdateRequest {
  name?: string
  step_order?: number
}

export enum TemplateType {
  START = 0,
  MESSAGE = 1,
  TREE = 2,
  LOTTERY_GROUP = 3,
  END = 4,
}

// Node Types
export interface Node {
  id: number
  template_id: number
  prize_id: number
  type: NodeType
  created: string
  modified: string
}

export enum NodeType {
  FIRST_TRIGGER = 0,
  MESSAGE = 1,
  MESSAGE_SELECT_OPTION = 2,
  LOTTERY = 3,
  LOTTERY_MESSAGE = 4,
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean
  message: string
  data?: T
  error?: string
  code?: string
}

export interface PaginationInfo {
  total: number
  page: number
  limit: number
  total_pages: number
  has_next_page: boolean
  has_prev_page: boolean
}

export interface PaginatedResponse<T> {
  items: T[]
  pagination: PaginationInfo
}