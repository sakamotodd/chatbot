import { Op } from 'sequelize';
import { InInstantwinButton } from '../../../database/models/in_instantwin_message_card_buttons';
import { InInstantwinCard } from '../../../database/models/in_instantwin_cards';
import { ButtonCreateRequest, ButtonUpdateRequest } from '../api/in_instantwin_message_card_buttons/types/button_request';
import { ButtonEntity, PaginationInfo } from '../api/in_instantwin_message_card_buttons/types/button_entities';
import { ButtonValidator } from '../api/in_instantwin_message_card_buttons/utils/button_validator';
import { BUTTON_CONSTANTS } from '../api/in_instantwin_message_card_buttons/utils/button_constants';

export class InInstantwinButtonService {
  static async createButton(data: ButtonCreateRequest): Promise<ButtonEntity> {
    // Validate request data
    const validation = ButtonValidator.validateCreateRequest(data);
    if (!validation.isValid) {
      throw new Error(`${BUTTON_CONSTANTS.ERROR_CODES.VALIDATION_ERROR}: ${validation.errors.join(', ')}`);
    }

    // Verify that the card exists
    const card = await InInstantwinCard.findByPk(data.card_id);
    if (!card) {
      throw new Error(`${BUTTON_CONSTANTS.ERROR_CODES.CARD_NOT_FOUND}: Card not found`);
    }

    // If no step_order is provided, set it to the next available order for this card
    let stepOrder = data.step_order;
    if (stepOrder === undefined) {
      const lastButton = await InInstantwinButton.findOne({
        where: { card_id: data.card_id },
        order: [['step_order', 'DESC']],
      });
      stepOrder = lastButton ? lastButton.step_order + 1 : 1;
    } else {
      // Check for duplicate step order within the same card
      const existingButton = await InInstantwinButton.findOne({
        where: {
          card_id: data.card_id,
          step_order: stepOrder,
        },
      });
      if (existingButton) {
        throw new Error(`${BUTTON_CONSTANTS.ERROR_CODES.DUPLICATE_STEP_ORDER}: Step order ${stepOrder} already exists for this card`);
      }
    }

    // Create the button
    const button = await InInstantwinButton.create({
      card_id: data.card_id,
      text: data.text.trim(),
      type: data.type,
      value: data.value?.trim(),
      url: data.url?.trim(),
      step_order: stepOrder,
    });

    return this.convertToEntity(button);
  }

  static async getButtonById(id: number): Promise<ButtonEntity | null> {
    const button = await InInstantwinButton.findByPk(id);
    return button ? this.convertToEntity(button) : null;
  }

  static async getButtons(filters: {
    card_id?: number;
    type?: number;
  }, page: number = 1, limit: number = BUTTON_CONSTANTS.DEFAULT_PAGE_SIZE): Promise<{
    buttons: ButtonEntity[];
    pagination: PaginationInfo;
  }> {
    const where: any = {};

    if (filters.card_id) {
      where.card_id = filters.card_id;
    }
    if (filters.type !== undefined) {
      where.type = filters.type;
    }

    const offset = (page - 1) * limit;

    const { count, rows } = await InInstantwinButton.findAndCountAll({
      where,
      limit,
      offset,
      order: [['card_id', 'ASC'], ['step_order', 'ASC'], ['created', 'ASC']],
    });

    const totalPages = Math.ceil(count / limit);

    return {
      buttons: rows.map(button => this.convertToEntity(button)),
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

  static async updateButton(id: number, data: ButtonUpdateRequest): Promise<ButtonEntity | null> {
    // Validate request data
    const validation = ButtonValidator.validateUpdateRequest(data);
    if (!validation.isValid) {
      throw new Error(`${BUTTON_CONSTANTS.ERROR_CODES.VALIDATION_ERROR}: ${validation.errors.join(', ')}`);
    }

    const button = await InInstantwinButton.findByPk(id);
    if (!button) {
      return null;
    }

    // Verify card exists if being updated
    if (data.card_id !== undefined) {
      const card = await InInstantwinCard.findByPk(data.card_id);
      if (!card) {
        throw new Error(`${BUTTON_CONSTANTS.ERROR_CODES.CARD_NOT_FOUND}: Card not found`);
      }
    }

    // Check for duplicate step order if being updated
    if (data.step_order !== undefined) {
      const cardId = data.card_id !== undefined ? data.card_id : button.card_id;
      const existingButton = await InInstantwinButton.findOne({
        where: {
          card_id: cardId,
          step_order: data.step_order,
          id: { [Op.ne]: id }, // Exclude current button
        },
      });
      if (existingButton) {
        throw new Error(`${BUTTON_CONSTANTS.ERROR_CODES.DUPLICATE_STEP_ORDER}: Step order ${data.step_order} already exists for this card`);
      }
    }

    // Update the button
    await button.update({
      card_id: data.card_id !== undefined ? data.card_id : button.card_id,
      text: data.text !== undefined ? data.text.trim() : button.text,
      type: data.type !== undefined ? data.type : button.type,
      value: data.value !== undefined ? data.value?.trim() : button.value,
      url: data.url !== undefined ? data.url?.trim() : button.url,
      step_order: data.step_order !== undefined ? data.step_order : button.step_order,
    });

    return this.convertToEntity(button);
  }

  static async deleteButton(id: number): Promise<boolean> {
    const button = await InInstantwinButton.findByPk(id);
    if (!button) {
      return false;
    }

    await button.destroy();
    return true;
  }

  static async getButtonsByCardId(cardId: number): Promise<ButtonEntity[]> {
    const buttons = await InInstantwinButton.findAll({
      where: { card_id: cardId },
      order: [['step_order', 'ASC'], ['created', 'ASC']],
    });

    return buttons.map(button => this.convertToEntity(button));
  }

  private static convertToEntity(button: InInstantwinButton): ButtonEntity {
    return {
      id: button.id,
      card_id: button.card_id,
      text: button.text,
      type: button.type,
      value: button.value,
      url: button.url,
      step_order: button.step_order,
      created: button.created,
      modified: button.modified,
    };
  }
}