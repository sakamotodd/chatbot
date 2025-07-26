// Select option entity types for internal processing
export interface SelectOptionEntity {
  id: number;
  message_id: number;
  text: string;
  value: string;
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