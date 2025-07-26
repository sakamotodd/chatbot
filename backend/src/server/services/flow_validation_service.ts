import { InInstantwinTemplate } from '../models/in_instantwin_templates';
import { InInstantwinNode } from '../models/in_instantwin_nodes';
import { InInstantwinEdge } from '../models/in_instantwin_edges';
import { FlowValidationResult, FlowValidationError, FlowValidationWarning, FlowStatistics } from '../api/flow/types/flow_request';
import { FLOW_CONSTANTS } from '../api/flow/utils/flow_constants';

export class FlowValidationService {
  static async validateFlow(templateId: number): Promise<FlowValidationResult> {
    // Verify template exists
    const template = await InInstantwinTemplate.findByPk(templateId);
    if (!template) {
      throw new Error(`${FLOW_CONSTANTS.ERROR_CODES.TEMPLATE_NOT_FOUND}: Template not found`);
    }

    // Get all nodes and edges for this template
    const nodes = await InInstantwinNode.findAll({
      where: { template_id: templateId },
      order: [['step_order', 'ASC'], ['id', 'ASC']],
    });

    const edges = await InInstantwinEdge.findAll({
      where: { template_id: templateId },
    });

    if (nodes.length === 0) {
      throw new Error(`${FLOW_CONSTANTS.ERROR_CODES.NO_NODES_FOUND}: No nodes found for template`);
    }

    const errors: FlowValidationError[] = [];
    const warnings: FlowValidationWarning[] = [];

    // Build adjacency maps for analysis
    const outgoingEdges = new Map<number, number[]>(); // node_id -> target_node_ids[]
    const incomingEdges = new Map<number, number[]>(); // node_id -> source_node_ids[]

    for (const edge of edges) {
      // Outgoing edges
      if (!outgoingEdges.has(edge.source_node_id)) {
        outgoingEdges.set(edge.source_node_id, []);
      }
      outgoingEdges.get(edge.source_node_id)!.push(edge.target_node_id);

      // Incoming edges
      if (!incomingEdges.has(edge.target_node_id)) {
        incomingEdges.set(edge.target_node_id, []);
      }
      incomingEdges.get(edge.target_node_id)!.push(edge.source_node_id);
    }

    // Validate node types and structure
    const nodesByType = this.categorizeNodesByType(nodes);
    this.validateNodeStructure(nodesByType, errors, warnings);

    // Validate connectivity
    this.validateConnectivity(nodes, outgoingEdges, incomingEdges, errors, warnings);

    // Check for circular references
    this.validateCircularReferences(nodes, outgoingEdges, errors);

    // Calculate statistics
    const statistics = this.calculateStatistics(nodes, edges, outgoingEdges);

    return {
      is_valid: errors.length === 0,
      errors,
      warnings,
      statistics,
    };
  }

  private static categorizeNodesByType(nodes: InInstantwinNode[]) {
    const nodesByType = {
      start: nodes.filter(n => n.type === FLOW_CONSTANTS.NODE_TYPES.START),
      message: nodes.filter(n => n.type === FLOW_CONSTANTS.NODE_TYPES.MESSAGE),
      tree: nodes.filter(n => n.type === FLOW_CONSTANTS.NODE_TYPES.TREE),
      lottery_group: nodes.filter(n => n.type === FLOW_CONSTANTS.NODE_TYPES.LOTTERY_GROUP),
      end: nodes.filter(n => n.type === FLOW_CONSTANTS.NODE_TYPES.END),
    };
    return nodesByType;
  }

  private static validateNodeStructure(
    nodesByType: ReturnType<typeof FlowValidationService.categorizeNodesByType>,
    errors: FlowValidationError[],
    warnings: FlowValidationWarning[]
  ) {
    // Check for required start node
    if (nodesByType.start.length === 0) {
      errors.push({
        type: 'missing_start_node',
        message: 'スタートノードが見つかりません',
      });
    } else if (nodesByType.start.length > 1) {
      warnings.push({
        type: 'multiple_start_nodes',
        message: '複数のスタートノードが存在します',
        details: { count: nodesByType.start.length },
      });
    }

    // Check for required end node
    if (nodesByType.end.length === 0) {
      errors.push({
        type: 'missing_end_node',
        message: 'エンドノードが見つかりません',
      });
    } else if (nodesByType.end.length > 1) {
      warnings.push({
        type: 'multiple_end_nodes',
        message: '複数のエンドノードが存在します',
        details: { count: nodesByType.end.length },
      });
    }
  }

  private static validateConnectivity(
    nodes: InInstantwinNode[],
    outgoingEdges: Map<number, number[]>,
    incomingEdges: Map<number, number[]>,
    errors: FlowValidationError[],
    warnings: FlowValidationWarning[]
  ) {
    // Find orphaned nodes (no incoming or outgoing edges)
    for (const node of nodes) {
      const hasIncoming = incomingEdges.has(node.id);
      const hasOutgoing = outgoingEdges.has(node.id);

      // Start nodes should not have incoming edges
      if (node.type === FLOW_CONSTANTS.NODE_TYPES.START && hasIncoming) {
        warnings.push({
          type: 'complex_path',
          message: 'スタートノードに入力エッジがあります',
          node_id: node.id,
        });
      }

      // End nodes should not have outgoing edges
      if (node.type === FLOW_CONSTANTS.NODE_TYPES.END && hasOutgoing) {
        warnings.push({
          type: 'complex_path',
          message: 'エンドノードに出力エッジがあります',
          node_id: node.id,
        });
      }

      // Other nodes should have both incoming and outgoing edges
      if (node.type !== FLOW_CONSTANTS.NODE_TYPES.START && 
          node.type !== FLOW_CONSTANTS.NODE_TYPES.END) {
        if (!hasIncoming && !hasOutgoing) {
          errors.push({
            type: 'orphaned_node',
            message: '孤立したノードが見つかりました',
            node_id: node.id,
          });
        } else if (!hasIncoming) {
          errors.push({
            type: 'unreachable_node',
            message: '到達不可能なノードが見つかりました',
            node_id: node.id,
          });
        } else if (!hasOutgoing && node.type !== FLOW_CONSTANTS.NODE_TYPES.END) {
          warnings.push({
            type: 'unused_node',
            message: '出力エッジがないノードが見つかりました',
            node_id: node.id,
          });
        }
      }
    }

    // Check reachability from start nodes
    this.validateReachability(nodes, outgoingEdges, errors);
  }

  private static validateReachability(
    nodes: InInstantwinNode[],
    outgoingEdges: Map<number, number[]>,
    errors: FlowValidationError[]
  ) {
    const startNodes = nodes.filter(n => n.type === FLOW_CONSTANTS.NODE_TYPES.START);
    const allNodeIds = new Set(nodes.map(n => n.id));
    const reachableNodes = new Set<number>();

    // BFS from each start node
    for (const startNode of startNodes) {
      const queue = [startNode.id];
      const visited = new Set<number>();

      while (queue.length > 0) {
        const currentNodeId = queue.shift()!;
        
        if (visited.has(currentNodeId)) {
          continue;
        }
        visited.add(currentNodeId);
        reachableNodes.add(currentNodeId);

        const targets = outgoingEdges.get(currentNodeId) || [];
        for (const targetId of targets) {
          if (!visited.has(targetId)) {
            queue.push(targetId);
          }
        }
      }
    }

    // Check for unreachable nodes
    for (const nodeId of allNodeIds) {
      if (!reachableNodes.has(nodeId)) {
        const node = nodes.find(n => n.id === nodeId);
        if (node && node.type !== FLOW_CONSTANTS.NODE_TYPES.START) {
          errors.push({
            type: 'unreachable_node',
            message: 'スタートノードから到達できないノードがあります',
            node_id: nodeId,
          });
        }
      }
    }
  }

  private static validateCircularReferences(
    nodes: InInstantwinNode[],
    outgoingEdges: Map<number, number[]>,
    errors: FlowValidationError[]
  ) {
    const visited = new Set<number>();
    const recursionStack = new Set<number>();

    const hasCycle = (nodeId: number): boolean => {
      if (recursionStack.has(nodeId)) {
        return true;
      }
      if (visited.has(nodeId)) {
        return false;
      }

      visited.add(nodeId);
      recursionStack.add(nodeId);

      const targets = outgoingEdges.get(nodeId) || [];
      for (const targetId of targets) {
        if (hasCycle(targetId)) {
          return true;
        }
      }

      recursionStack.delete(nodeId);
      return false;
    };

    for (const node of nodes) {
      if (!visited.has(node.id)) {
        if (hasCycle(node.id)) {
          errors.push({
            type: 'circular_reference',
            message: 'フローに循環参照が検出されました',
            node_id: node.id,
          });
          break; // One error is enough for circular reference detection
        }
      }
    }
  }

  private static calculateStatistics(
    nodes: InInstantwinNode[],
    edges: InInstantwinEdge[],
    outgoingEdges: Map<number, number[]>
  ): FlowStatistics {
    const nodesByType = this.categorizeNodesByType(nodes);
    
    // Calculate maximum path depth and total paths
    const { maxDepth, totalPaths } = this.calculatePathStatistics(nodes, outgoingEdges);

    return {
      total_nodes: nodes.length,
      total_edges: edges.length,
      start_nodes: nodesByType.start.length,
      end_nodes: nodesByType.end.length,
      message_nodes: nodesByType.message.length,
      tree_nodes: nodesByType.tree.length,
      lottery_group_nodes: nodesByType.lottery_group.length,
      max_path_depth: maxDepth,
      total_paths: totalPaths,
    };
  }

  private static calculatePathStatistics(
    nodes: InInstantwinNode[],
    outgoingEdges: Map<number, number[]>
  ): { maxDepth: number; totalPaths: number } {
    const startNodes = nodes.filter(n => n.type === FLOW_CONSTANTS.NODE_TYPES.START);
    const endNodes = new Set(nodes.filter(n => n.type === FLOW_CONSTANTS.NODE_TYPES.END).map(n => n.id));
    
    let maxDepth = 0;
    let totalPaths = 0;

    const dfs = (nodeId: number, depth: number, visited: Set<number>): void => {
      if (depth > FLOW_CONSTANTS.MAX_PATH_DEPTH || totalPaths > FLOW_CONSTANTS.MAX_TOTAL_PATHS) {
        return; // Prevent infinite recursion and excessive computation
      }

      if (visited.has(nodeId)) {
        return; // Prevent cycles in path counting
      }

      maxDepth = Math.max(maxDepth, depth);

      if (endNodes.has(nodeId)) {
        totalPaths++;
        return;
      }

      const newVisited = new Set(visited);
      newVisited.add(nodeId);

      const targets = outgoingEdges.get(nodeId) || [];
      if (targets.length === 0 && !endNodes.has(nodeId)) {
        // Dead end, count as a path
        totalPaths++;
      } else {
        for (const targetId of targets) {
          dfs(targetId, depth + 1, newVisited);
        }
      }
    };

    for (const startNode of startNodes) {
      dfs(startNode.id, 1, new Set());
    }

    return { maxDepth, totalPaths };
  }
}