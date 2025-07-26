// Template entity types for internal processing
export interface TemplateEntity {
  id: number;
  prize_id: number;
  name?: string;
  type: number;
  step_order: number;
  is_active: boolean;
  created: Date;
  modified: Date;
}

export interface TemplateWithRelations extends TemplateEntity {
  nodes?: NodeEntity[];
  messages?: MessageEntity[];
  selectOptions?: SelectOptionEntity[];
}

export interface NodeEntity {
  id: number;
  template_id?: number;
  prize_id: number;
  type: string;
  created: Date;
  modified: Date;
}

export interface MessageEntity {
  id: number;
  node_id?: number;
  prize_id: number;
  text?: string;
  message_type?: string;
  created: Date;
  modified: Date;
}

export interface SelectOptionEntity {
  id: number;
  node_id?: number;
  parent_node_id?: number;
  prize_id: number;
  select_option: string;
  display_order: number;
  created: Date;
  modified: Date;
}

export interface DeleteResult {
  nodes: number;
  edges: number;
  messages: number;
  select_options: number;
}