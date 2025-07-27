// Select option API request types
export interface SelectOptionCreateRequest {
  message_id: number;
  text: string;
  value: string;
  step_order?: number;
}

export interface SelectOptionUpdateRequest {
  message_id?: number;
  text?: string;
  value?: string;
  step_order?: number;
}

export interface SelectOptionQueryParams {
  message_id?: number;
  page?: number;
  limit?: number;
}