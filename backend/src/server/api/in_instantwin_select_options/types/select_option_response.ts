// Select option API response types
export interface SelectOptionResponse {
  id: number;
  message_id: number;
  text: string;
  value: string;
  step_order: number;
  created: Date;
  modified: Date;
}

export interface SelectOptionListResponse {
  in_instantwin_select_options: SelectOptionResponse[];
  pagination: {
    current_page: number;
    total_pages: number;
    total_count: number;
    per_page: number;
    has_next: boolean;
    has_prev: boolean;
  };
}

export interface SelectOptionDetailResponse {
  in_instantwin_select_option: SelectOptionResponse;
}