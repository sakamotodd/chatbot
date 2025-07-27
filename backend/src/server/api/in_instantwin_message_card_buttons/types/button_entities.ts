// Button entity types for internal processing
export interface ButtonEntity {
  id: number;
  card_id: number;
  text: string;
  type: number;
  value?: string;
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