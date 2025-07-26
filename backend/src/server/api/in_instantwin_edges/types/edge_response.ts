// Edge API response types
export interface EdgeResponse {
  id: number;
  template_id?: number;
  prize_id: number;
  source_node_id: number;
  target_node_id: number;
  condition?: string;
  created: Date;
  modified: Date;
}

export interface EdgeListResponse {
  in_instantwin_edges: EdgeResponse[];
  pagination: {
    current_page: number;
    total_pages: number;
    total_count: number;
    per_page: number;
    has_next: boolean;
    has_prev: boolean;
  };
}

export interface EdgeDetailResponse {
  in_instantwin_edge: EdgeResponse;
}