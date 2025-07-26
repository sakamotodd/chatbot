// Card entity types for internal processing
export interface CardEntity {
  id: number;
  message_id: number;
  title?: string;
  subtitle?: string;
  image_url?: string;
  url?: string;
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