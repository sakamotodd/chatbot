import { Op } from 'sequelize';
import { InInstantwinCard } from '../../../database/models/in_instantwin_cards';
import { InInstantwinMessage } from '../../../database/models/in_instantwin_messages';
import { CardCreateRequest, CardUpdateRequest } from '../api/in_instantwin_cards/types/card_request';
import { CardEntity, PaginationInfo } from '../api/in_instantwin_cards/types/card_entities';
import { CardValidator } from '../api/in_instantwin_cards/utils/card_validator';
import { CARD_CONSTANTS } from '../api/in_instantwin_cards/utils/card_constants';

export class InInstantwinCardService {
  static async createCard(data: CardCreateRequest): Promise<CardEntity> {
    // Validate request data
    const validation = CardValidator.validateCreateRequest(data);
    if (!validation.isValid) {
      throw new Error(`${CARD_CONSTANTS.ERROR_CODES.VALIDATION_ERROR}: ${validation.errors.join(', ')}`);
    }

    // Verify that the message exists
    const message = await InInstantwinMessage.findByPk(data.message_id);
    if (!message) {
      throw new Error(`${CARD_CONSTANTS.ERROR_CODES.MESSAGE_NOT_FOUND}: Message not found`);
    }

    // If no step_order is provided, set it to the next available order for this message
    let stepOrder = data.step_order;
    if (stepOrder === undefined) {
      const lastCard = await InInstantwinCard.findOne({
        where: { message_id: data.message_id },
        order: [['step_order', 'DESC']],
      });
      stepOrder = lastCard ? lastCard.step_order + 1 : 1;
    } else {
      // Check for duplicate step order within the same message
      const existingCard = await InInstantwinCard.findOne({
        where: {
          message_id: data.message_id,
          step_order: stepOrder,
        },
      });
      if (existingCard) {
        throw new Error(`${CARD_CONSTANTS.ERROR_CODES.DUPLICATE_STEP_ORDER}: Step order ${stepOrder} already exists for this message`);
      }
    }

    // Create the card
    const card = await InInstantwinCard.create({
      message_id: data.message_id,
      title: data.title?.trim(),
      subtitle: data.subtitle?.trim(),
      image_url: data.image_url?.trim(),
      url: data.url?.trim(),
      step_order: stepOrder,
    });

    return this.convertToEntity(card);
  }

  static async getCardById(id: number): Promise<CardEntity | null> {
    const card = await InInstantwinCard.findByPk(id);
    return card ? this.convertToEntity(card) : null;
  }

  static async getCards(filters: {
    message_id?: number;
  }, page: number = 1, limit: number = CARD_CONSTANTS.DEFAULT_PAGE_SIZE): Promise<{
    cards: CardEntity[];
    pagination: PaginationInfo;
  }> {
    const where: any = {};

    if (filters.message_id) {
      where.message_id = filters.message_id;
    }

    const offset = (page - 1) * limit;

    const { count, rows } = await InInstantwinCard.findAndCountAll({
      where,
      limit,
      offset,
      order: [['message_id', 'ASC'], ['step_order', 'ASC'], ['created', 'ASC']],
    });

    const totalPages = Math.ceil(count / limit);

    return {
      cards: rows.map(card => this.convertToEntity(card)),
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

  static async updateCard(id: number, data: CardUpdateRequest): Promise<CardEntity | null> {
    // Validate request data
    const validation = CardValidator.validateUpdateRequest(data);
    if (!validation.isValid) {
      throw new Error(`${CARD_CONSTANTS.ERROR_CODES.VALIDATION_ERROR}: ${validation.errors.join(', ')}`);
    }

    const card = await InInstantwinCard.findByPk(id);
    if (!card) {
      return null;
    }

    // Verify message exists if being updated
    if (data.message_id !== undefined) {
      const message = await InInstantwinMessage.findByPk(data.message_id);
      if (!message) {
        throw new Error(`${CARD_CONSTANTS.ERROR_CODES.MESSAGE_NOT_FOUND}: Message not found`);
      }
    }

    // Check for duplicate step order if being updated
    if (data.step_order !== undefined) {
      const messageId = data.message_id !== undefined ? data.message_id : card.message_id;
      const existingCard = await InInstantwinCard.findOne({
        where: {
          message_id: messageId,
          step_order: data.step_order,
          id: { [Op.ne]: id }, // Exclude current card
        },
      });
      if (existingCard) {
        throw new Error(`${CARD_CONSTANTS.ERROR_CODES.DUPLICATE_STEP_ORDER}: Step order ${data.step_order} already exists for this message`);
      }
    }

    // Update the card
    await card.update({
      message_id: data.message_id !== undefined ? data.message_id : card.message_id,
      title: data.title !== undefined ? data.title?.trim() : card.title,
      subtitle: data.subtitle !== undefined ? data.subtitle?.trim() : card.subtitle,
      image_url: data.image_url !== undefined ? data.image_url?.trim() : card.image_url,
      url: data.url !== undefined ? data.url?.trim() : card.url,
      step_order: data.step_order !== undefined ? data.step_order : card.step_order,
    });

    return this.convertToEntity(card);
  }

  static async deleteCard(id: number): Promise<boolean> {
    const card = await InInstantwinCard.findByPk(id);
    if (!card) {
      return false;
    }

    await card.destroy();
    return true;
  }

  static async getCardsByMessageId(messageId: number): Promise<CardEntity[]> {
    const cards = await InInstantwinCard.findAll({
      where: { message_id: messageId },
      order: [['step_order', 'ASC'], ['created', 'ASC']],
    });

    return cards.map(card => this.convertToEntity(card));
  }

  private static convertToEntity(card: InInstantwinCard): CardEntity {
    return {
      id: card.id,
      message_id: card.message_id,
      title: card.title,
      subtitle: card.subtitle,
      image_url: card.image_url,
      url: card.url,
      step_order: card.step_order,
      created: card.created,
      modified: card.modified,
    };
  }
}