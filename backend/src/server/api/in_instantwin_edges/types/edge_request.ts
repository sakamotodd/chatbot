// Edge API request types
export interface EdgeCreateRequest {
  template_id?: number;
  prize_id: number;
  source_node_id: number;
  target_node_id: number;
  condition?: string;
}

export interface EdgeUpdateRequest {
  template_id?: number;
  source_node_id?: number;
  target_node_id?: number;
  condition?: string;
}

export interface EdgeQueryParams {
  template_id?: number;
  prize_id?: number;
  source_node_id?: number;
  target_node_id?: number;
  page?: number;
  limit?: number;
}