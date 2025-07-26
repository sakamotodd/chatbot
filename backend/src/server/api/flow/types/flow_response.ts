// Flow validation response types
export interface FlowValidationResponse {
  flow_validation: {
    is_valid: boolean;
    errors: Array<{
      type: string;
      message: string;
      node_id?: number;
      edge_id?: number;
      details?: any;
    }>;
    warnings: Array<{
      type: string;
      message: string;
      node_id?: number;
      edge_id?: number;
      details?: any;
    }>;
    statistics: {
      total_nodes: number;
      total_edges: number;
      start_nodes: number;
      end_nodes: number;
      message_nodes: number;
      tree_nodes: number;
      lottery_group_nodes: number;
      max_path_depth: number;
      total_paths: number;
    };
  };
}