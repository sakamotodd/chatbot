// Template API request types
export interface TemplateCreateRequest {
  name: string;
  type: string;
  step_order?: number;
}

export interface TemplateUpdateRequest {
  name?: string;
  step_order?: number;
}

export interface TemplateQueryParams {
  page?: string;
  limit?: string;
  include_nodes?: string;
  include_messages?: string;
  include_select_options?: string;
}