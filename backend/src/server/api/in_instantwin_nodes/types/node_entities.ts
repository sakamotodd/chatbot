// Node entity types for internal processing
export interface NodeEntity {
  id: number;
  template_id?: number;
  prize_id: number;
  type: number;
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