import { Op } from 'sequelize';
import { InInstantwinConversation } from '../models/in_instantwin_conversations';
import { InInstantwinTemplate } from '../models/in_instantwin_templates';
import { InInstantwinNode } from '../models/in_instantwin_nodes';
import { ConversationCreateRequest, ConversationUpdateRequest } from '../api/in_instantwin_conversations/types/conversation_request';
import { ConversationEntity, PaginationInfo } from '../api/in_instantwin_conversations/types/conversation_entities';
import { ConversationValidator } from '../api/in_instantwin_conversations/utils/conversation_validator';
import { CONVERSATION_CONSTANTS } from '../api/in_instantwin_conversations/utils/conversation_constants';

export class InInstantwinConversationService {
  static async createConversation(data: ConversationCreateRequest): Promise<ConversationEntity> {
    // Validate request data
    const validation = ConversationValidator.validateCreateRequest(data);
    if (!validation.isValid) {
      throw new Error(`${CONVERSATION_CONSTANTS.ERROR_CODES.VALIDATION_ERROR}: ${validation.errors.join(', ')}`);
    }

    // Verify that the template exists
    const template = await InInstantwinTemplate.findByPk(data.template_id);
    if (!template) {
      throw new Error(`${CONVERSATION_CONSTANTS.ERROR_CODES.TEMPLATE_NOT_FOUND}: Template not found`);
    }

    // Verify node exists if provided
    if (data.current_node_id) {
      const node = await InInstantwinNode.findByPk(data.current_node_id);
      if (!node) {
        throw new Error(`${CONVERSATION_CONSTANTS.ERROR_CODES.NODE_NOT_FOUND}: Node not found`);
      }
    }

    // Create the conversation
    const conversation = await InInstantwinConversation.create({
      template_id: data.template_id,
      user_id: data.user_id.trim(),
      status: data.status !== undefined ? data.status : CONVERSATION_CONSTANTS.CONVERSATION_STATUS.ACTIVE,
      current_node_id: data.current_node_id,
      metadata: data.metadata,
      started_at: new Date(),
    });

    return this.convertToEntity(conversation);
  }

  static async getConversationById(id: number): Promise<ConversationEntity | null> {
    const conversation = await InInstantwinConversation.findByPk(id);
    return conversation ? this.convertToEntity(conversation) : null;
  }

  static async getConversations(filters: {
    template_id?: number;
    user_id?: string;
    status?: number;
  }, page: number = 1, limit: number = CONVERSATION_CONSTANTS.DEFAULT_PAGE_SIZE): Promise<{
    conversations: ConversationEntity[];
    pagination: PaginationInfo;
  }> {
    const where: any = {};

    if (filters.template_id) {
      where.template_id = filters.template_id;
    }
    if (filters.user_id) {
      where.user_id = filters.user_id;
    }
    if (filters.status !== undefined) {
      where.status = filters.status;
    }

    const offset = (page - 1) * limit;

    const { count, rows } = await InInstantwinConversation.findAndCountAll({
      where,
      limit,
      offset,
      order: [['started_at', 'DESC'], ['created', 'DESC']],
    });

    const totalPages = Math.ceil(count / limit);

    return {
      conversations: rows.map(conversation => this.convertToEntity(conversation)),
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

  static async updateConversation(id: number, data: ConversationUpdateRequest): Promise<ConversationEntity | null> {
    // Validate request data
    const validation = ConversationValidator.validateUpdateRequest(data);
    if (!validation.isValid) {
      throw new Error(`${CONVERSATION_CONSTANTS.ERROR_CODES.VALIDATION_ERROR}: ${validation.errors.join(', ')}`);
    }

    const conversation = await InInstantwinConversation.findByPk(id);
    if (!conversation) {
      return null;
    }

    // Verify template exists if being updated
    if (data.template_id !== undefined) {
      const template = await InInstantwinTemplate.findByPk(data.template_id);
      if (!template) {
        throw new Error(`${CONVERSATION_CONSTANTS.ERROR_CODES.TEMPLATE_NOT_FOUND}: Template not found`);
      }
    }

    // Verify node exists if being updated
    if (data.current_node_id !== undefined) {
      const node = await InInstantwinNode.findByPk(data.current_node_id);
      if (!node) {
        throw new Error(`${CONVERSATION_CONSTANTS.ERROR_CODES.NODE_NOT_FOUND}: Node not found`);
      }
    }

    // Check if conversation is already ended and prevent updates to ended conversations
    if (conversation.status === CONVERSATION_CONSTANTS.CONVERSATION_STATUS.COMPLETED && 
        data.status !== undefined && 
        data.status !== CONVERSATION_CONSTANTS.CONVERSATION_STATUS.COMPLETED) {
      throw new Error(`${CONVERSATION_CONSTANTS.ERROR_CODES.CONVERSATION_ALREADY_ENDED}: Cannot modify completed conversation`);
    }

    // Update the conversation
    const updateData: any = {
      template_id: data.template_id !== undefined ? data.template_id : conversation.template_id,
      user_id: data.user_id !== undefined ? data.user_id.trim() : conversation.user_id,
      status: data.status !== undefined ? data.status : conversation.status,
      current_node_id: data.current_node_id !== undefined ? data.current_node_id : conversation.current_node_id,
      metadata: data.metadata !== undefined ? data.metadata : conversation.metadata,
    };

    // Set ended_at if status is being changed to completed or abandoned
    if (data.status !== undefined && 
        (data.status === CONVERSATION_CONSTANTS.CONVERSATION_STATUS.COMPLETED || 
         data.status === CONVERSATION_CONSTANTS.CONVERSATION_STATUS.ABANDONED) &&
        !conversation.ended_at) {
      updateData.ended_at = new Date();
    }

    await conversation.update(updateData);

    return this.convertToEntity(conversation);
  }

  static async deleteConversation(id: number): Promise<boolean> {
    const conversation = await InInstantwinConversation.findByPk(id);
    if (!conversation) {
      return false;
    }

    await conversation.destroy();
    return true;
  }

  static async getConversationsByUserId(userId: string): Promise<ConversationEntity[]> {
    const conversations = await InInstantwinConversation.findAll({
      where: { user_id: userId },
      order: [['started_at', 'DESC']],
    });

    return conversations.map(conversation => this.convertToEntity(conversation));
  }

  static async getActiveConversationByUser(userId: string, templateId?: number): Promise<ConversationEntity | null> {
    const where: any = {
      user_id: userId,
      status: CONVERSATION_CONSTANTS.CONVERSATION_STATUS.ACTIVE,
    };

    if (templateId) {
      where.template_id = templateId;
    }

    const conversation = await InInstantwinConversation.findOne({
      where,
      order: [['started_at', 'DESC']],
    });

    return conversation ? this.convertToEntity(conversation) : null;
  }

  static async endConversation(id: number, status: number = CONVERSATION_CONSTANTS.CONVERSATION_STATUS.COMPLETED): Promise<ConversationEntity | null> {
    const conversation = await InInstantwinConversation.findByPk(id);
    if (!conversation) {
      return null;
    }

    if (conversation.ended_at) {
      throw new Error(`${CONVERSATION_CONSTANTS.ERROR_CODES.CONVERSATION_ALREADY_ENDED}: Conversation is already ended`);
    }

    await conversation.update({
      status,
      ended_at: new Date(),
    });

    return this.convertToEntity(conversation);
  }

  private static convertToEntity(conversation: InInstantwinConversation): ConversationEntity {
    return {
      id: conversation.id,
      template_id: conversation.template_id,
      user_id: conversation.user_id,
      status: conversation.status,
      current_node_id: conversation.current_node_id,
      metadata: conversation.metadata,
      started_at: conversation.started_at,
      ended_at: conversation.ended_at,
      created: conversation.created,
      modified: conversation.modified,
    };
  }
}