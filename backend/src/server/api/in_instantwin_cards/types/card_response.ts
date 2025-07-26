// Card API response types
export interface CardResponse {
  id: number;
  message_id: number;
  title?: string;
  subtitle?: string;
  image_url?: string;
  url?: string;
  step_order: number;
  created: Date;
  modified: Date;
}

export interface CardListResponse {
  in_instantwin_cards: CardResponse[];
  pagination: {
    current_page: number;
    total_pages: number;
    total_count: number;
    per_page: number;
    has_next: boolean;
    has_prev: boolean;
  };
}

export interface CardDetailResponse {
  in_instantwin_card: CardResponse;
}