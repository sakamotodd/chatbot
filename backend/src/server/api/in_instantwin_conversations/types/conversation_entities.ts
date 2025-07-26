// Conversation entity types for internal processing
export interface ConversationEntity {
  id: number;
  template_id: number;
  user_id: string;
  status: number;
  current_node_id?: number;
  metadata?: any;
  started_at: Date;
  ended_at?: Date;
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