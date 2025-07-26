// Node API request types
export interface NodeCreateRequest {
  template_id?: number;
  prize_id: number;
  type: string;
}

export interface NodeUpdateRequest {
  template_id?: number;
  type?: string;
}

export interface NodeQueryParams {
  template_id?: number;
  prize_id?: number;
  type?: string;
  page?: number;
  limit?: number;
}