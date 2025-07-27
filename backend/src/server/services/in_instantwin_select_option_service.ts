import { Op } from 'sequelize';
import { InInstantwinMessageSelectOption } from '../../../database/models/in_instantwin_message_select_options';
import { InInstantwinMessage } from '../../../database/models/in_instantwin_messages';
import { SelectOptionCreateRequest, SelectOptionUpdateRequest } from '../api/in_instantwin_message_select_options/types/select_option_request';
import { SelectOptionEntity, PaginationInfo } from '../api/in_instantwin_message_select_options/types/select_option_entities';
import { SelectOptionValidator } from '../api/in_instantwin_message_select_options/utils/select_option_validator';
import { SELECT_OPTION_CONSTANTS } from '../api/in_instantwin_message_select_options/utils/select_option_constants';

export class InInstantwinMessageSelectOptionService {
  static async createSelectOption(data: SelectOptionCreateRequest): Promise<SelectOptionEntity> {
    // Validate request data
    const validation = SelectOptionValidator.validateCreateRequest(data);
    if (!validation.isValid) {
      throw new Error(`${SELECT_OPTION_CONSTANTS.ERROR_CODES.VALIDATION_ERROR}: ${validation.errors.join(', ')}`);
    }

    // Verify that the message exists
    const message = await InInstantwinMessage.findByPk(data.message_id);
    if (!message) {
      throw new Error(`${SELECT_OPTION_CONSTANTS.ERROR_CODES.MESSAGE_NOT_FOUND}: Message not found`);
    }

    // Check for duplicate value within the same message
    const existingOption = await InInstantwinMessageSelectOption.findOne({
      where: {
        message_id: data.message_id,
        value: data.value.trim(),
      },
    });
    if (existingOption) {
      throw new Error(`${SELECT_OPTION_CONSTANTS.ERROR_CODES.DUPLICATE_VALUE}: Value '${data.value}' already exists for this message`);
    }

    // If no step_order is provided, set it to the next available order for this message
    let stepOrder = data.step_order;
    if (stepOrder === undefined) {
      const lastOption = await InInstantwinMessageSelectOption.findOne({
        where: { message_id: data.message_id },
        order: [['step_order', 'DESC']],
      });
      stepOrder = lastOption ? lastOption.step_order + 1 : 1;
    } else {
      // Check for duplicate step order within the same message
      const existingOrder = await InInstantwinMessageSelectOption.findOne({
        where: {
          message_id: data.message_id,
          step_order: stepOrder,
        },
      });
      if (existingOrder) {
        throw new Error(`${SELECT_OPTION_CONSTANTS.ERROR_CODES.DUPLICATE_STEP_ORDER}: Step order ${stepOrder} already exists for this message`);
      }
    }

    // Create the select option
    const selectOption = await InInstantwinMessageSelectOption.create({
      message_id: data.message_id,
      text: data.text.trim(),
      value: data.value.trim(),
      step_order: stepOrder,
    });

    return this.convertToEntity(selectOption);
  }

  static async getSelectOptionById(id: number): Promise<SelectOptionEntity | null> {
    const selectOption = await InInstantwinMessageSelectOption.findByPk(id);
    return selectOption ? this.convertToEntity(selectOption) : null;
  }

  static async getSelectOptions(filters: {
    message_id?: number;
  }, page: number = 1, limit: number = SELECT_OPTION_CONSTANTS.DEFAULT_PAGE_SIZE): Promise<{
    selectOptions: SelectOptionEntity[];
    pagination: PaginationInfo;
  }> {
    const where: any = {};

    if (filters.message_id) {
      where.message_id = filters.message_id;
    }

    const offset = (page - 1) * limit;

    const { count, rows } = await InInstantwinMessageSelectOption.findAndCountAll({
      where,
      limit,
      offset,
      order: [['message_id', 'ASC'], ['step_order', 'ASC'], ['created', 'ASC']],
    });

    const totalPages = Math.ceil(count / limit);

    return {
      selectOptions: rows.map(option => this.convertToEntity(option)),
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

  static async updateSelectOption(id: number, data: SelectOptionUpdateRequest): Promise<SelectOptionEntity | null> {
    // Validate request data
    const validation = SelectOptionValidator.validateUpdateRequest(data);
    if (!validation.isValid) {
      throw new Error(`${SELECT_OPTION_CONSTANTS.ERROR_CODES.VALIDATION_ERROR}: ${validation.errors.join(', ')}`);
    }

    const selectOption = await InInstantwinMessageSelectOption.findByPk(id);
    if (!selectOption) {
      return null;
    }

    // Verify message exists if being updated
    if (data.message_id !== undefined) {
      const message = await InInstantwinMessage.findByPk(data.message_id);
      if (!message) {
        throw new Error(`${SELECT_OPTION_CONSTANTS.ERROR_CODES.MESSAGE_NOT_FOUND}: Message not found`);
      }
    }

    // Check for duplicate value if being updated
    if (data.value !== undefined) {
      const messageId = data.message_id !== undefined ? data.message_id : selectOption.message_id;
      const existingOption = await InInstantwinMessageSelectOption.findOne({
        where: {
          message_id: messageId,
          value: data.value.trim(),
          id: { [Op.ne]: id }, // Exclude current option
        },
      });
      if (existingOption) {
        throw new Error(`${SELECT_OPTION_CONSTANTS.ERROR_CODES.DUPLICATE_VALUE}: Value '${data.value}' already exists for this message`);
      }
    }

    // Check for duplicate step order if being updated
    if (data.step_order !== undefined) {
      const messageId = data.message_id !== undefined ? data.message_id : selectOption.message_id;
      const existingOrder = await InInstantwinMessageSelectOption.findOne({
        where: {
          message_id: messageId,
          step_order: data.step_order,
          id: { [Op.ne]: id }, // Exclude current option
        },
      });
      if (existingOrder) {
        throw new Error(`${SELECT_OPTION_CONSTANTS.ERROR_CODES.DUPLICATE_STEP_ORDER}: Step order ${data.step_order} already exists for this message`);
      }
    }

    // Update the select option
    await selectOption.update({
      message_id: data.message_id !== undefined ? data.message_id : selectOption.message_id,
      text: data.text !== undefined ? data.text.trim() : selectOption.text,
      value: data.value !== undefined ? data.value.trim() : selectOption.value,
      step_order: data.step_order !== undefined ? data.step_order : selectOption.step_order,
    });

    return this.convertToEntity(selectOption);
  }

  static async deleteSelectOption(id: number): Promise<boolean> {
    const selectOption = await InInstantwinMessageSelectOption.findByPk(id);
    if (!selectOption) {
      return false;
    }

    await selectOption.destroy();
    return true;
  }

  static async getSelectOptionsByMessageId(messageId: number): Promise<SelectOptionEntity[]> {
    const selectOptions = await InInstantwinMessageSelectOption.findAll({
      where: { message_id: messageId },
      order: [['step_order', 'ASC'], ['created', 'ASC']],
    });

    return selectOptions.map(option => this.convertToEntity(option));
  }

  static async reorderSelectOptions(messageId: number, optionOrders: { id: number; step_order: number }[]): Promise<SelectOptionEntity[]> {
    // Verify that the message exists
    const message = await InInstantwinMessage.findByPk(messageId);
    if (!message) {
      throw new Error(`${SELECT_OPTION_CONSTANTS.ERROR_CODES.MESSAGE_NOT_FOUND}: Message not found`);
    }

    // Verify all select options belong to the specified message
    const optionIds = optionOrders.map(oo => oo.id);
    const selectOptions = await InInstantwinMessageSelectOption.findAll({
      where: {
        id: optionIds,
        message_id: messageId,
      },
    });

    if (selectOptions.length !== optionOrders.length) {
      throw new Error(`${SELECT_OPTION_CONSTANTS.ERROR_CODES.SELECT_OPTION_NOT_FOUND}: Some select options not found or do not belong to the specified message`);
    }

    // Update step orders
    for (const orderData of optionOrders) {
      await InInstantwinMessageSelectOption.update(
        { step_order: orderData.step_order },
        { where: { id: orderData.id } }
      );
    }

    // Return updated select options
    return this.getSelectOptionsByMessageId(messageId);
  }

  private static convertToEntity(selectOption: InInstantwinMessageSelectOption): SelectOptionEntity {
    return {
      id: selectOption.id,
      message_id: selectOption.message_id,
      text: selectOption.text,
      value: selectOption.value,
      step_order: selectOption.step_order,
      created: selectOption.created,
      modified: selectOption.modified,
    };
  }
}