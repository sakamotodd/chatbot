// Button API request types
export interface ButtonCreateRequest {
  card_id: number;
  text: string;
  type: number; // ButtonType enum
  value?: string;
  url?: string;
  step_order?: number;
}

export interface ButtonUpdateRequest {
  card_id?: number;
  text?: string;
  type?: number;
  value?: string;
  url?: string;
  step_order?: number;
}

export interface ButtonQueryParams {
  card_id?: number;
  type?: number;
  page?: number;
  limit?: number;
}