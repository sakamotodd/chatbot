// Flow validation request types
export interface FlowValidationRequest {
  template_id: number;
}

export interface FlowValidationResult {
  is_valid: boolean;
  errors: FlowValidationError[];
  warnings: FlowValidationWarning[];
  statistics: FlowStatistics;
}

export interface FlowValidationError {
  type: 'orphaned_node' | 'unreachable_node' | 'missing_start_node' | 'missing_end_node' | 'invalid_node_type' | 'circular_reference' | 'missing_edges';
  message: string;
  node_id?: number;
  edge_id?: number;
  details?: any;
}

export interface FlowValidationWarning {
  type: 'multiple_start_nodes' | 'multiple_end_nodes' | 'unused_node' | 'complex_path';
  message: string;
  node_id?: number;
  edge_id?: number;
  details?: any;
}

export interface FlowStatistics {
  total_nodes: number;
  total_edges: number;
  start_nodes: number;
  end_nodes: number;
  message_nodes: number;
  tree_nodes: number;
  lottery_group_nodes: number;
  max_path_depth: number;
  total_paths: number;
}