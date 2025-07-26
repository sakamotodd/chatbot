// Message API response types
export interface MessageResponse {
  id: number;
  node_id: number;
  type: number;
  content: string;
  step_order: number;
  created: Date;
  modified: Date;
}

export interface MessageListResponse {
  in_instantwin_messages: MessageResponse[];
  pagination: {
    current_page: number;
    total_pages: number;
    total_count: number;
    per_page: number;
    has_next: boolean;
    has_prev: boolean;
  };
}

export interface MessageDetailResponse {
  in_instantwin_message: MessageResponse;
}