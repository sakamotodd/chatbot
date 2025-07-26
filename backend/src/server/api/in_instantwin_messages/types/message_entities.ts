// Message entity types for internal processing
export interface MessageEntity {
  id: number;
  node_id: number;
  type: number;
  content: string;
  step_order: number;
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