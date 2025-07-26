// Conversation API request types
export interface ConversationCreateRequest {
  template_id: number;
  user_id: string;
  status?: number; // ConversationStatus enum
  current_node_id?: number;
  metadata?: any;
}

export interface ConversationUpdateRequest {
  template_id?: number;
  user_id?: string;
  status?: number;
  current_node_id?: number;
  metadata?: any;
}

export interface ConversationQueryParams {
  template_id?: number;
  user_id?: string;
  status?: number;
  page?: number;
  limit?: number;
}