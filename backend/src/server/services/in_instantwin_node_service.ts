import { InInstantwinNode, InInstantwinNodeCreationAttributes, NodeType } from '../../../database/models/in_instantwin_nodes';
import { InInstantwinTemplate } from '../../../database/models/in_instantwin_templates';
import { InInstantwinPrize } from '../../../database/models/in_instantwin_prizes';
import { InInstantwinMessage } from '../../../database/models/in_instantwin_messages';
import { InInstantwinMessageSelectOption } from '../../../database/models/in_instantwin_message_select_options';
import { InInstantwinEdge } from '../../../database/models/in_instantwin_edges';
import { Op } from 'sequelize';
import logger from '../utils/logger';
import { NODE_CONSTANTS } from '../api/in_instantwin_nodes/utils/node_constants';
import { NodeCreateRequest, NodeUpdateRequest } from '../api/in_instantwin_nodes/types/node_request';
import { PaginationInfo } from '../api/in_instantwin_nodes/types/node_entities';

export class InInstantwinNodeService {
  static async getAllNodes(options: {
    page?: number;
    limit?: number;
    template_id?: number;
    prize_id?: number;
    type?: number;
  }) {
    const {
      page = 1,
      limit = NODE_CONSTANTS.DEFAULT_PAGE_SIZE,
      template_id,
      prize_id,
      type,
    } = options;

    const offset = (page - 1) * limit;
    const where: any = {};

    // Apply filters
    if (template_id) where.template_id = template_id;
    if (prize_id) where.prize_id = prize_id;
    if (type !== undefined) where.type = type;

    try {
      const { count, rows } = await InInstantwinNode.findAndCountAll({
        where,
        order: [['created', 'DESC']],
        limit,
        offset,
      });

      const pagination: PaginationInfo = {
        current_page: page,
        total_pages: Math.ceil(count / limit),
        total_count: count,
        per_page: limit,
        has_next: page < Math.ceil(count / limit),
        has_prev: page > 1,
      };

      return {
        nodes: rows,
        pagination,
      };
    } catch (error) {
      logger.error('ノード一覧取得エラー:', error);
      throw error;
    }
  }

  static async getNodeById(id: number) {
    try {
      const node = await InInstantwinNode.findByPk(id);

      if (!node) {
        const error = new Error('指定されたノードが見つかりません') as any;
        error.statusCode = 404;
        error.code = NODE_CONSTANTS.ERROR_CODES.NODE_NOT_FOUND;
        throw error;
      }

      return node;
    } catch (error) {
      logger.error('ノード詳細取得エラー:', error);
      throw error;
    }
  }

  static async createNode(nodeData: NodeCreateRequest) {
    try {
      // Verify prize exists
      const prize = await InInstantwinPrize.findByPk(nodeData.prize_id);
      if (!prize) {
        const error = new Error('指定されたプライズが見つかりません') as any;
        error.statusCode = 404;
        error.code = NODE_CONSTANTS.ERROR_CODES.PRIZE_NOT_FOUND;
        throw error;
      }

      // Verify template exists if provided
      if (nodeData.template_id) {
        const template = await InInstantwinTemplate.findByPk(nodeData.template_id);
        if (!template) {
          const error = new Error('指定されたテンプレートが見つかりません') as any;
          error.statusCode = 404;
          error.code = NODE_CONSTANTS.ERROR_CODES.TEMPLATE_NOT_FOUND;
          throw error;
        }

        // Verify template belongs to the same prize
        if (template.prize_id !== nodeData.prize_id) {
          const error = new Error('テンプレートとプライズの関係が不正です') as any;
          error.statusCode = 400;
          error.code = NODE_CONSTANTS.ERROR_CODES.VALIDATION_ERROR;
          throw error;
        }
      }

      // Get node type number
      const nodeTypeNumber = NODE_CONSTANTS.NODE_TYPE_MAP[nodeData.type as keyof typeof NODE_CONSTANTS.NODE_TYPE_MAP];

      // Prepare node creation data
      const nodeCreationData: InInstantwinNodeCreationAttributes = {
        template_id: nodeData.template_id,
        prize_id: nodeData.prize_id,
        type: nodeTypeNumber as NodeType,
      };

      // Create node
      const node = await InInstantwinNode.create(nodeCreationData);

      logger.info('ノードが作成されました:', {
        id: node.id,
        template_id: node.template_id,
        prize_id: node.prize_id,
        type: nodeData.type,
      });

      return node;
    } catch (error) {
      logger.error('ノード作成エラー:', error);
      throw error;
    }
  }

  static async updateNode(id: number, updateData: NodeUpdateRequest) {
    try {
      const node = await InInstantwinNode.findByPk(id);

      if (!node) {
        const error = new Error('指定されたノードが見つかりません') as any;
        error.statusCode = 404;
        error.code = NODE_CONSTANTS.ERROR_CODES.NODE_NOT_FOUND;
        throw error;
      }

      // Verify template exists if provided
      if (updateData.template_id) {
        const template = await InInstantwinTemplate.findByPk(updateData.template_id);
        if (!template) {
          const error = new Error('指定されたテンプレートが見つかりません') as any;
          error.statusCode = 404;
          error.code = NODE_CONSTANTS.ERROR_CODES.TEMPLATE_NOT_FOUND;
          throw error;
        }

        // Verify template belongs to the same prize
        if (template.prize_id !== node.prize_id) {
          const error = new Error('テンプレートとプライズの関係が不正です') as any;
          error.statusCode = 400;
          error.code = NODE_CONSTANTS.ERROR_CODES.VALIDATION_ERROR;
          throw error;
        }
      }

      // Prepare update data
      const updateFields: any = {};
      
      if (updateData.template_id !== undefined) updateFields.template_id = updateData.template_id;
      if (updateData.type !== undefined) {
        const nodeTypeNumber = NODE_CONSTANTS.NODE_TYPE_MAP[updateData.type as keyof typeof NODE_CONSTANTS.NODE_TYPE_MAP];
        updateFields.type = nodeTypeNumber;
      }

      await node.update(updateFields);

      logger.info('ノードが更新されました:', {
        id,
        template_id: node.template_id,
        type: updateData.type,
      });

      return node;
    } catch (error) {
      logger.error('ノード更新エラー:', error);
      throw error;
    }
  }

  static async deleteNode(id: number) {
    try {
      const node = await InInstantwinNode.findByPk(id);

      if (!node) {
        const error = new Error('指定されたノードが見つかりません') as any;
        error.statusCode = 404;
        error.code = NODE_CONSTANTS.ERROR_CODES.NODE_NOT_FOUND;
        throw error;
      }

      // Count related data before deletion
      const messagesCount = await InInstantwinMessage.count({ where: { node_id: id } });
      const selectOptionsCount = await InInstantwinMessageSelectOption.count({ where: { node_id: id } });
      const edgesCount = await InInstantwinEdge.count({
        where: {
          [Op.or]: [
            { source_node_id: id },
            { target_node_id: id },
          ],
        },
      });

      // Delete related data in correct order
      await InInstantwinMessageSelectOption.destroy({ where: { node_id: id } });
      await InInstantwinMessage.destroy({ where: { node_id: id } });
      await InInstantwinEdge.destroy({
        where: {
          [Op.or]: [
            { source_node_id: id },
            { target_node_id: id },
          ],
        },
      });

      // Delete the node
      await node.destroy();

      logger.info('ノードが削除されました:', {
        id,
        related_data: { messagesCount, selectOptionsCount, edgesCount },
      });

      return {
        messages: messagesCount,
        select_options: selectOptionsCount,
        edges: edgesCount,
      };
    } catch (error) {
      logger.error('ノード削除エラー:', error);
      throw error;
    }
  }
}

export default InInstantwinNodeService;