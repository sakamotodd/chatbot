// Card API request types
export interface CardCreateRequest {
  message_id: number;
  title?: string;
  subtitle?: string;
  image_url?: string;
  url?: string;
  step_order?: number;
}

export interface CardUpdateRequest {
  message_id?: number;
  title?: string;
  subtitle?: string;
  image_url?: string;
  url?: string;
  step_order?: number;
}

export interface CardQueryParams {
  message_id?: number;
  page?: number;
  limit?: number;
}