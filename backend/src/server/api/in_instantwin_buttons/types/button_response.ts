// Button API response types
export interface ButtonResponse {
  id: number;
  card_id: number;
  text: string;
  type: number;
  value?: string;
  url?: string;
  step_order: number;
  created: Date;
  modified: Date;
}

export interface ButtonListResponse {
  in_instantwin_buttons: ButtonResponse[];
  pagination: {
    current_page: number;
    total_pages: number;
    total_count: number;
    per_page: number;
    has_next: boolean;
    has_prev: boolean;
  };
}

export interface ButtonDetailResponse {
  in_instantwin_button: ButtonResponse;
}