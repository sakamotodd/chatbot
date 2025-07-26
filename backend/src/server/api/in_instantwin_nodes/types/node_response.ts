// Node API response types
export interface NodeResponse {
  id: number;
  template_id?: number;
  prize_id: number;
  type: number;
  created: Date;
  modified: Date;
}

export interface NodeListResponse {
  in_instantwin_nodes: NodeResponse[];
  pagination: {
    current_page: number;
    total_pages: number;
    total_count: number;
    per_page: number;
    has_next: boolean;
    has_prev: boolean;
  };
}

export interface NodeDetailResponse {
  in_instantwin_node: NodeResponse;
}