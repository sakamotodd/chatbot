import { Op } from 'sequelize';
import { InInstantwinMessage } from '../models/in_instantwin_messages';
import { InInstantwinNode } from '../models/in_instantwin_nodes';
import { MessageCreateRequest, MessageUpdateRequest } from '../api/in_instantwin_messages/types/message_request';
import { MessageEntity, PaginationInfo } from '../api/in_instantwin_messages/types/message_entities';
import { MessageValidator } from '../api/in_instantwin_messages/utils/message_validator';
import { MESSAGE_CONSTANTS } from '../api/in_instantwin_messages/utils/message_constants';

export class InInstantwinMessageService {
  static async createMessage(data: MessageCreateRequest): Promise<MessageEntity> {
    // Validate request data
    const validation = MessageValidator.validateCreateRequest(data);
    if (!validation.isValid) {
      throw new Error(`${MESSAGE_CONSTANTS.ERROR_CODES.VALIDATION_ERROR}: ${validation.errors.join(', ')}`);
    }

    // Verify that the node exists
    const node = await InInstantwinNode.findByPk(data.node_id);
    if (!node) {
      throw new Error(`${MESSAGE_CONSTANTS.ERROR_CODES.NODE_NOT_FOUND}: Node not found`);
    }

    // If no step_order is provided, set it to the next available order for this node
    let stepOrder = data.step_order;
    if (stepOrder === undefined) {
      const lastMessage = await InInstantwinMessage.findOne({
        where: { node_id: data.node_id },
        order: [['step_order', 'DESC']],
      });
      stepOrder = lastMessage ? lastMessage.step_order + 1 : 1;
    } else {
      // Check for duplicate step order within the same node
      const existingMessage = await InInstantwinMessage.findOne({
        where: {
          node_id: data.node_id,
          step_order: stepOrder,
        },
      });
      if (existingMessage) {
        throw new Error(`${MESSAGE_CONSTANTS.ERROR_CODES.DUPLICATE_STEP_ORDER}: Step order ${stepOrder} already exists for this node`);
      }
    }

    // Create the message
    const message = await InInstantwinMessage.create({
      node_id: data.node_id,
      type: data.type,
      content: data.content.trim(),
      step_order: stepOrder,
    });

    return this.convertToEntity(message);
  }

  static async getMessageById(id: number): Promise<MessageEntity | null> {
    const message = await InInstantwinMessage.findByPk(id);
    return message ? this.convertToEntity(message) : null;
  }

  static async getMessages(filters: {
    node_id?: number;
    type?: number;
  }, page: number = 1, limit: number = MESSAGE_CONSTANTS.DEFAULT_PAGE_SIZE): Promise<{
    messages: MessageEntity[];
    pagination: PaginationInfo;
  }> {
    const where: any = {};

    if (filters.node_id) {
      where.node_id = filters.node_id;
    }
    if (filters.type !== undefined) {
      where.type = filters.type;
    }

    const offset = (page - 1) * limit;

    const { count, rows } = await InInstantwinMessage.findAndCountAll({
      where,
      limit,
      offset,
      order: [['node_id', 'ASC'], ['step_order', 'ASC'], ['created', 'ASC']],
    });

    const totalPages = Math.ceil(count / limit);

    return {
      messages: rows.map(message => this.convertToEntity(message)),
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

  static async updateMessage(id: number, data: MessageUpdateRequest): Promise<MessageEntity | null> {
    // Validate request data
    const validation = MessageValidator.validateUpdateRequest(data);
    if (!validation.isValid) {
      throw new Error(`${MESSAGE_CONSTANTS.ERROR_CODES.VALIDATION_ERROR}: ${validation.errors.join(', ')}`);
    }

    const message = await InInstantwinMessage.findByPk(id);
    if (!message) {
      return null;
    }

    // Verify node exists if being updated
    if (data.node_id !== undefined) {
      const node = await InInstantwinNode.findByPk(data.node_id);
      if (!node) {
        throw new Error(`${MESSAGE_CONSTANTS.ERROR_CODES.NODE_NOT_FOUND}: Node not found`);
      }
    }

    // Check for duplicate step order if being updated
    if (data.step_order !== undefined) {
      const nodeId = data.node_id !== undefined ? data.node_id : message.node_id;
      const existingMessage = await InInstantwinMessage.findOne({
        where: {
          node_id: nodeId,
          step_order: data.step_order,
          id: { [Op.ne]: id }, // Exclude current message
        },
      });
      if (existingMessage) {
        throw new Error(`${MESSAGE_CONSTANTS.ERROR_CODES.DUPLICATE_STEP_ORDER}: Step order ${data.step_order} already exists for this node`);
      }
    }

    // Update the message
    await message.update({
      node_id: data.node_id !== undefined ? data.node_id : message.node_id,
      type: data.type !== undefined ? data.type : message.type,
      content: data.content !== undefined ? data.content.trim() : message.content,
      step_order: data.step_order !== undefined ? data.step_order : message.step_order,
    });

    return this.convertToEntity(message);
  }

  static async deleteMessage(id: number): Promise<boolean> {
    const message = await InInstantwinMessage.findByPk(id);
    if (!message) {
      return false;
    }

    await message.destroy();
    return true;
  }

  static async getMessagesByNodeId(nodeId: number): Promise<MessageEntity[]> {
    const messages = await InInstantwinMessage.findAll({
      where: { node_id: nodeId },
      order: [['step_order', 'ASC'], ['created', 'ASC']],
    });

    return messages.map(message => this.convertToEntity(message));
  }

  static async reorderMessages(nodeId: number, messageOrders: { id: number; step_order: number }[]): Promise<MessageEntity[]> {
    // Verify that the node exists
    const node = await InInstantwinNode.findByPk(nodeId);
    if (!node) {
      throw new Error(`${MESSAGE_CONSTANTS.ERROR_CODES.NODE_NOT_FOUND}: Node not found`);
    }

    // Verify all messages belong to the specified node
    const messageIds = messageOrders.map(mo => mo.id);
    const messages = await InInstantwinMessage.findAll({
      where: {
        id: messageIds,
        node_id: nodeId,
      },
    });

    if (messages.length !== messageOrders.length) {
      throw new Error(`${MESSAGE_CONSTANTS.ERROR_CODES.MESSAGE_NOT_FOUND}: Some messages not found or do not belong to the specified node`);
    }

    // Update step orders
    for (const orderData of messageOrders) {
      await InInstantwinMessage.update(
        { step_order: orderData.step_order },
        { where: { id: orderData.id } }
      );
    }

    // Return updated messages
    return this.getMessagesByNodeId(nodeId);
  }

  private static convertToEntity(message: InInstantwinMessage): MessageEntity {
    return {
      id: message.id,
      node_id: message.node_id,
      type: message.type,
      content: message.content,
      step_order: message.step_order,
      created: message.created,
      modified: message.modified,
    };
  }
}