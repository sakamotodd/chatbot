// Message API request types
export interface MessageCreateRequest {
  node_id: number;
  type: number; // MessageType enum
  content: string;
  step_order?: number;
}

export interface MessageUpdateRequest {
  node_id?: number;
  type?: number;
  content?: string;
  step_order?: number;
}

export interface MessageQueryParams {
  node_id?: number;
  type?: number;
  page?: number;
  limit?: number;
}