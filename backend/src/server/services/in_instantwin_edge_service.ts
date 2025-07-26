import { Op } from 'sequelize';
import { InInstantwinEdge } from '../../../database/models/in_instantwin_edges';
import { InInstantwinNode } from '../../../database/models/in_instantwin_nodes';
import { InInstantwinTemplate } from '../../../database/models/in_instantwin_templates';
import { InInstantwinPrize } from '../../../database/models/in_instantwin_prizes';
import { EdgeCreateRequest, EdgeUpdateRequest } from '../api/in_instantwin_edges/types/edge_request';
import { EdgeEntity, PaginationInfo } from '../api/in_instantwin_edges/types/edge_entities';
import { EdgeValidator } from '../api/in_instantwin_edges/utils/edge_validator';
import { EDGE_CONSTANTS } from '../api/in_instantwin_edges/utils/edge_constants';

export class InInstantwinEdgeService {
  static async createEdge(data: EdgeCreateRequest): Promise<EdgeEntity> {
    // Validate request data
    const validation = EdgeValidator.validateCreateRequest(data);
    if (!validation.isValid) {
      throw new Error(`${EDGE_CONSTANTS.ERROR_CODES.VALIDATION_ERROR}: ${validation.errors.join(', ')}`);
    }

    // Verify that source and target nodes exist
    const sourceNode = await InInstantwinNode.findByPk(data.source_node_id);
    if (!sourceNode) {
      throw new Error(`${EDGE_CONSTANTS.ERROR_CODES.NODE_NOT_FOUND}: Source node not found`);
    }

    const targetNode = await InInstantwinNode.findByPk(data.target_node_id);
    if (!targetNode) {
      throw new Error(`${EDGE_CONSTANTS.ERROR_CODES.NODE_NOT_FOUND}: Target node not found`);
    }

    // Verify template exists if provided
    if (data.template_id) {
      const template = await InInstantwinTemplate.findByPk(data.template_id);
      if (!template) {
        throw new Error(`${EDGE_CONSTANTS.ERROR_CODES.TEMPLATE_NOT_FOUND}: Template not found`);
      }
    }

    // Verify prize exists
    const prize = await InInstantwinPrize.findByPk(data.prize_id);
    if (!prize) {
      throw new Error(`${EDGE_CONSTANTS.ERROR_CODES.PRIZE_NOT_FOUND}: Prize not found`);
    }

    // Check for circular references
    await this.checkCircularReference(data.source_node_id, data.target_node_id);

    // Create the edge
    const edge = await InInstantwinEdge.create({
      template_id: data.template_id,
      prize_id: data.prize_id,
      source_node_id: data.source_node_id,
      target_node_id: data.target_node_id,
      condition: data.condition,
    });

    return this.convertToEntity(edge);
  }

  static async getEdgeById(id: number): Promise<EdgeEntity | null> {
    const edge = await InInstantwinEdge.findByPk(id);
    return edge ? this.convertToEntity(edge) : null;
  }

  static async getEdges(filters: {
    template_id?: number;
    prize_id?: number;
    source_node_id?: number;
    target_node_id?: number;
  }, page: number = 1, limit: number = EDGE_CONSTANTS.DEFAULT_PAGE_SIZE): Promise<{
    edges: EdgeEntity[];
    pagination: PaginationInfo;
  }> {
    const where: any = {};

    if (filters.template_id) {
      where.template_id = filters.template_id;
    }
    if (filters.prize_id) {
      where.prize_id = filters.prize_id;
    }
    if (filters.source_node_id) {
      where.source_node_id = filters.source_node_id;
    }
    if (filters.target_node_id) {
      where.target_node_id = filters.target_node_id;
    }

    const offset = (page - 1) * limit;

    const { count, rows } = await InInstantwinEdge.findAndCountAll({
      where,
      limit,
      offset,
      order: [['created', 'DESC']],
    });

    const totalPages = Math.ceil(count / limit);

    return {
      edges: rows.map(edge => this.convertToEntity(edge)),
      pagination: {
        current_page: page,
        total_pages: totalPages,
        total_count: count,
        per_page: limit,
        has_next: page < totalPages,
        has_prev: page > 1,
      },
    };
  }

  static async updateEdge(id: number, data: EdgeUpdateRequest): Promise<EdgeEntity | null> {
    // Validate request data
    const validation = EdgeValidator.validateUpdateRequest(data);
    if (!validation.isValid) {
      throw new Error(`${EDGE_CONSTANTS.ERROR_CODES.VALIDATION_ERROR}: ${validation.errors.join(', ')}`);
    }

    const edge = await InInstantwinEdge.findByPk(id);
    if (!edge) {
      return null;
    }

    // Verify nodes exist if being updated
    if (data.source_node_id !== undefined) {
      const sourceNode = await InInstantwinNode.findByPk(data.source_node_id);
      if (!sourceNode) {
        throw new Error(`${EDGE_CONSTANTS.ERROR_CODES.NODE_NOT_FOUND}: Source node not found`);
      }
    }

    if (data.target_node_id !== undefined) {
      const targetNode = await InInstantwinNode.findByPk(data.target_node_id);
      if (!targetNode) {
        throw new Error(`${EDGE_CONSTANTS.ERROR_CODES.NODE_NOT_FOUND}: Target node not found`);
      }
    }

    // Verify template exists if being updated
    if (data.template_id !== undefined) {
      const template = await InInstantwinTemplate.findByPk(data.template_id);
      if (!template) {
        throw new Error(`${EDGE_CONSTANTS.ERROR_CODES.TEMPLATE_NOT_FOUND}: Template not found`);
      }
    }

    // Check for circular references if nodes are being updated
    const newSourceNodeId = data.source_node_id !== undefined ? data.source_node_id : edge.source_node_id;
    const newTargetNodeId = data.target_node_id !== undefined ? data.target_node_id : edge.target_node_id;
    
    if (data.source_node_id !== undefined || data.target_node_id !== undefined) {
      await this.checkCircularReference(newSourceNodeId, newTargetNodeId, id);
    }

    // Update the edge
    await edge.update({
      template_id: data.template_id !== undefined ? data.template_id : edge.template_id,
      source_node_id: newSourceNodeId,
      target_node_id: newTargetNodeId,
      condition: data.condition !== undefined ? data.condition : edge.condition,
    });

    return this.convertToEntity(edge);
  }

  static async deleteEdge(id: number): Promise<boolean> {
    const edge = await InInstantwinEdge.findByPk(id);
    if (!edge) {
      return false;
    }

    await edge.destroy();
    return true;
  }

  private static async checkCircularReference(sourceNodeId: number, targetNodeId: number, excludeEdgeId?: number): Promise<void> {
    // Prevent direct self-reference
    if (sourceNodeId === targetNodeId) {
      throw new Error(`${EDGE_CONSTANTS.ERROR_CODES.CIRCULAR_REFERENCE}: Cannot create edge from node to itself`);
    }

    // Check for circular paths using BFS
    const visited = new Set<number>();
    const queue = [targetNodeId];

    while (queue.length > 0) {
      const currentNodeId = queue.shift()!;
      
      if (visited.has(currentNodeId)) {
        continue;
      }
      visited.add(currentNodeId);

      // If we reach back to the source node, there's a circular reference
      if (currentNodeId === sourceNodeId) {
        throw new Error(`${EDGE_CONSTANTS.ERROR_CODES.CIRCULAR_REFERENCE}: Creating this edge would create a circular reference`);
      }

      // Find all nodes that the current node points to
      const whereClause: any = { source_node_id: currentNodeId };
      if (excludeEdgeId) {
        whereClause.id = { [Op.ne]: excludeEdgeId };
      }

      const outgoingEdges = await InInstantwinEdge.findAll({
        where: whereClause,
        attributes: ['target_node_id'],
      });

      for (const edge of outgoingEdges) {
        if (!visited.has(edge.target_node_id)) {
          queue.push(edge.target_node_id);
        }
      }
    }
  }

  private static convertToEntity(edge: InInstantwinEdge): EdgeEntity {
    return {
      id: edge.id,
      template_id: edge.template_id,
      prize_id: edge.prize_id,
      source_node_id: edge.source_node_id,
      target_node_id: edge.target_node_id,
      condition: edge.condition,
      created: edge.created,
      modified: edge.modified,
    };
  }
}