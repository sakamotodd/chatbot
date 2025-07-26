// Template API response types
export interface TemplateResponse {
  id: number;
  prize_id: number;
  name?: string;
  type: number;
  step_order: number;
  is_active: boolean;
  created: Date;
  modified: Date;
  in_instantwin_nodes?: NodeResponse[];
  in_instantwin_messages?: MessageResponse[];
  in_instantwin_message_select_options?: SelectOptionResponse[];
}

export interface NodeResponse {
  id: number;
  template_id?: number;
  prize_id: number;
  type: string;
  created: Date;
  modified: Date;
}

export interface MessageResponse {
  id: number;
  node_id?: number;
  prize_id: number;
  text?: string;
  message_type?: string;
  created: Date;
  modified: Date;
}

export interface SelectOptionResponse {
  id: number;
  node_id?: number;
  parent_node_id?: number;
  prize_id: number;
  select_option: string;
  display_order: number;
  created: Date;
  modified: Date;
}

export interface TemplateDetailResponse {
  in_instantwin_template: TemplateResponse;
}

export interface TemplateDeleteResponse {
  deleted_template_id: number;
  deleted_related_data: {
    nodes: number;
    edges: number;
    messages: number;
    select_options: number;
  };
}