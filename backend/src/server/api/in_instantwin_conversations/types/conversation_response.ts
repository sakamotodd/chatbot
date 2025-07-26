// Conversation API response types
export interface ConversationResponse {
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

export interface ConversationListResponse {
  in_instantwin_conversations: ConversationResponse[];
  pagination: {
    current_page: number;
    total_pages: number;
    total_count: number;
    per_page: number;
    has_next: boolean;
    has_prev: boolean;
  };
}

export interface ConversationDetailResponse {
  in_instantwin_conversation: ConversationResponse;
}