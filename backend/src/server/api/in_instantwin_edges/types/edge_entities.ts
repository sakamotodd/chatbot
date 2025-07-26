// Edge entity types for internal processing
export interface EdgeEntity {
  id: number;
  template_id?: number;
  prize_id: number;
  source_node_id: number;
  target_node_id: number;
  condition?: string;
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