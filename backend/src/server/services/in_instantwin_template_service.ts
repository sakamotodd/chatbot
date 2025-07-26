import { InInstantwinTemplate, InInstantwinTemplateCreationAttributes, TemplateType } from '../../../database/models/in_instantwin_templates';
import { InInstantwinNode, NodeType } from '../../../database/models/in_instantwin_nodes';
import { InInstantwinMessage } from '../../../database/models/in_instantwin_messages';
import { InInstantwinMessageSelectOption } from '../../../database/models/in_instantwin_message_select_options';
import { InInstantwinEdge } from '../../../database/models/in_instantwin_edges';
import { InInstantwinPrize } from '../../../database/models/in_instantwin_prizes';
import { Op } from 'sequelize';
import logger from '../utils/logger';
import { TEMPLATE_CONSTANTS } from '../api/in_instantwin_templates/utils/template_constants';
import { TemplateCreateRequest, TemplateUpdateRequest } from '../api/in_instantwin_templates/types/template_request';
import { DeleteResult } from '../api/in_instantwin_templates/types/template_entities';

export class InInstantwinTemplateService {
  static async getAllTemplates(prizeId: number, options: {
    page?: number;
    limit?: number;
    include_nodes?: boolean;
    include_messages?: boolean;
    include_select_options?: boolean;
  }) {
    const {
      page = 1,
      limit = 20,
      include_nodes = false,
      include_messages = false,
      include_select_options = false,
    } = options;

    try {
      // Verify prize exists
      const prize = await InInstantwinPrize.findByPk(prizeId);
      if (!prize) {
        const error = new Error('指定されたプライズが見つかりません') as any;
        error.statusCode = 404;
        error.code = TEMPLATE_CONSTANTS.ERROR_CODES.PRIZE_NOT_FOUND;
        throw error;
      }

      // Build include options
      const includeOptions: any[] = [];
      
      if (include_nodes) {
        includeOptions.push({
          model: InInstantwinNode,
          as: 'nodes',
          attributes: ['id', 'template_id', 'prize_id', 'type', 'created', 'modified'],
        });
      }

      // Calculate pagination
      const offset = (page - 1) * limit;

      // Get templates with count
      const { count, rows } = await InInstantwinTemplate.findAndCountAll({
        where: { prize_id: prizeId },
        include: includeOptions,
        order: [['step_order', 'ASC'], ['created', 'ASC']],
        limit,
        offset,
      });

      // If messages or select options are requested but nodes are not included,
      // we need to fetch them separately through the nodes
      let templates = rows as any[];

      if ((include_messages || include_select_options) && !include_nodes) {
        for (const template of templates) {
          const nodeIds = await InInstantwinNode.findAll({
            where: { template_id: template.id },
            attributes: ['id'],
            raw: true,
          }).then(nodes => nodes.map(node => node.id));

          if (nodeIds.length > 0) {
            if (include_messages) {
              const messages = await InInstantwinMessage.findAll({
                where: { node_id: { [Op.in]: nodeIds } },
                attributes: ['id', 'node_id', 'prize_id', 'text', 'message_type', 'created', 'modified'],
              });
              template.messages = messages;
            }

            if (include_select_options) {
              const selectOptions = await InInstantwinMessageSelectOption.findAll({
                where: { node_id: { [Op.in]: nodeIds } },
                attributes: ['id', 'node_id', 'parent_node_id', 'prize_id', 'select_option', 'display_order', 'created', 'modified'],
                order: [['display_order', 'ASC']],
              });
              template.selectOptions = selectOptions;
            }
          }
        }
      }

      const totalPages = Math.ceil(count / limit);

      return {
        templates,
        pagination: {
          total: count,
          page,
          limit,
          total_pages: totalPages,
          has_next_page: page < totalPages,
          has_prev_page: page > 1,
        },
      };
    } catch (error) {
      logger.error('テンプレート一覧取得エラー:', error);
      throw error;
    }
  }

  static async getTemplateById(id: number, options: {
    include_nodes?: boolean;
    include_messages?: boolean;
    include_select_options?: boolean;
  }) {
    const {
      include_nodes = false,
      include_messages = false,
      include_select_options = false,
    } = options;

    try {
      // Build include options
      const includeOptions: any[] = [];
      
      if (include_nodes) {
        includeOptions.push({
          model: InInstantwinNode,
          as: 'nodes',
          attributes: ['id', 'template_id', 'prize_id', 'type', 'created', 'modified'],
        });
      }


      const template = await InInstantwinTemplate.findByPk(id, {
        include: includeOptions,
      });

      if (!template) {
        const error = new Error('指定されたテンプレートが見つかりません') as any;
        error.statusCode = 404;
        error.code = TEMPLATE_CONSTANTS.ERROR_CODES.TEMPLATE_NOT_FOUND;
        throw error;
      }

      // If messages or select options are requested but nodes are not included,
      // we need to fetch them separately through the nodes
      let result = template as any;

      if ((include_messages || include_select_options) && !include_nodes) {
        // Get node IDs for this template
        const nodeIds = await InInstantwinNode.findAll({
          where: { template_id: id },
          attributes: ['id'],
          raw: true,
        }).then(nodes => nodes.map(node => node.id));

        if (nodeIds.length > 0) {
          if (include_messages) {
            const messages = await InInstantwinMessage.findAll({
              where: { node_id: { [Op.in]: nodeIds } },
              attributes: ['id', 'node_id', 'prize_id', 'text', 'message_type', 'created', 'modified'],
            });
            result.messages = messages;
          }

          if (include_select_options) {
            const selectOptions = await InInstantwinMessageSelectOption.findAll({
              where: { node_id: { [Op.in]: nodeIds } },
              attributes: ['id', 'node_id', 'parent_node_id', 'prize_id', 'select_option', 'display_order', 'created', 'modified'],
              order: [['display_order', 'ASC']],
            });
            result.selectOptions = selectOptions;
          }
        }
      }

      return result;
    } catch (error) {
      logger.error('テンプレート詳細取得エラー:', error);
      throw error;
    }
  }

  static async createTemplate(prizeId: number, templateData: TemplateCreateRequest) {
    try {
      // Verify prize exists
      const prize = await InInstantwinPrize.findByPk(prizeId);
      if (!prize) {
        const error = new Error('指定されたプライズが見つかりません') as any;
        error.statusCode = 404;
        error.code = TEMPLATE_CONSTANTS.ERROR_CODES.PRIZE_NOT_FOUND;
        throw error;
      }

      // Calculate step order if not provided
      let stepOrder = templateData.step_order;
      if (!stepOrder) {
        const maxStepOrder = await InInstantwinTemplate.max('step_order', {
          where: { prize_id: prizeId }
        }) as number || 0;
        stepOrder = maxStepOrder + 1;
      } else {
        // Check for duplicate step order
        const existingTemplate = await InInstantwinTemplate.findOne({
          where: {
            prize_id: prizeId,
            step_order: stepOrder,
          },
        });

        if (existingTemplate) {
          // Shift existing templates
          await InInstantwinTemplate.update(
            { step_order: InInstantwinTemplate.sequelize!.literal('step_order + 1') },
            {
              where: {
                prize_id: prizeId,
                step_order: { [Op.gte]: stepOrder },
              },
            }
          );
        }
      }

      // Get template type number
      const templateTypeNumber = TEMPLATE_CONSTANTS.TEMPLATE_TYPE_MAP[templateData.type as keyof typeof TEMPLATE_CONSTANTS.TEMPLATE_TYPE_MAP];

      // Prepare template creation data
      const templateCreationData: InInstantwinTemplateCreationAttributes = {
        prize_id: prizeId,
        name: templateData.name,
        type: templateTypeNumber as TemplateType,
        step_order: stepOrder,
        is_active: true,
      };

      // Create template
      const template = await InInstantwinTemplate.create(templateCreationData);

      // Create default nodes based on template type
      const nodeConfigs = TEMPLATE_CONSTANTS.DEFAULT_NODE_CONFIGS[templateData.type as keyof typeof TEMPLATE_CONSTANTS.DEFAULT_NODE_CONFIGS];
      if (nodeConfigs) {
        const nodePromises = nodeConfigs.map(nodeConfig =>
          InInstantwinNode.create({
            template_id: template.id,
            prize_id: prizeId,
            type: nodeConfig.type as NodeType,
          })
        );

        await Promise.all(nodePromises);
      }

      logger.info('テンプレートが作成されました:', {
        id: template.id,
        name: template.name,
        type: templateData.type,
        prize_id: prizeId,
      });

      return template;
    } catch (error) {
      logger.error('テンプレート作成エラー:', error);
      throw error;
    }
  }

  static async updateTemplate(id: number, updateData: TemplateUpdateRequest) {
    try {
      const template = await InInstantwinTemplate.findByPk(id);

      if (!template) {
        const error = new Error('指定されたテンプレートが見つかりません') as any;
        error.statusCode = 404;
        error.code = TEMPLATE_CONSTANTS.ERROR_CODES.TEMPLATE_NOT_FOUND;
        throw error;
      }

      // Check step order conflict
      if (updateData.step_order !== undefined && updateData.step_order !== template.step_order) {
        const existingTemplate = await InInstantwinTemplate.findOne({
          where: {
            prize_id: template.prize_id,
            step_order: updateData.step_order,
            id: { [Op.ne]: id },
          },
        });

        if (existingTemplate) {
          const error = new Error('ステップ順序が他のテンプレートと重複しています') as any;
          error.statusCode = 409;
          error.code = TEMPLATE_CONSTANTS.ERROR_CODES.TEMPLATE_UPDATE_CONFLICT;
          error.details = {
            step_order: updateData.step_order,
            conflicting_template_id: existingTemplate.id,
          };
          throw error;
        }

        // Adjust other templates step order
        const oldStepOrder = template.step_order;
        const newStepOrder = updateData.step_order;

        if (newStepOrder > oldStepOrder) {
          // Moving down - shift templates between old and new position up
          await InInstantwinTemplate.update(
            { step_order: InInstantwinTemplate.sequelize!.literal('step_order - 1') },
            {
              where: {
                prize_id: template.prize_id,
                step_order: { [Op.gt]: oldStepOrder, [Op.lte]: newStepOrder },
                id: { [Op.ne]: id },
              },
            }
          );
        } else {
          // Moving up - shift templates between new and old position down
          await InInstantwinTemplate.update(
            { step_order: InInstantwinTemplate.sequelize!.literal('step_order + 1') },
            {
              where: {
                prize_id: template.prize_id,
                step_order: { [Op.gte]: newStepOrder, [Op.lt]: oldStepOrder },
                id: { [Op.ne]: id },
              },
            }
          );
        }
      }

      // Prepare update data
      const updateFields: any = {};
      
      if (updateData.name !== undefined) updateFields.name = updateData.name;
      if (updateData.step_order !== undefined) updateFields.step_order = updateData.step_order;

      await template.update(updateFields);

      logger.info('テンプレートが更新されました:', {
        id,
        name: template.name,
      });

      return template;
    } catch (error) {
      logger.error('テンプレート更新エラー:', error);
      throw error;
    }
  }

  static async deleteTemplate(id: number): Promise<DeleteResult> {
    try {
      const template = await InInstantwinTemplate.findByPk(id);

      if (!template) {
        const error = new Error('指定されたテンプレートが見つかりません') as any;
        error.statusCode = 404;
        error.code = TEMPLATE_CONSTANTS.ERROR_CODES.TEMPLATE_NOT_FOUND;
        throw error;
      }

      // Check if this is a required template
      const templateTypeName = TEMPLATE_CONSTANTS.TEMPLATE_TYPE_NAMES[template.type as keyof typeof TEMPLATE_CONSTANTS.TEMPLATE_TYPE_NAMES];
      if (TEMPLATE_CONSTANTS.REQUIRED_TEMPLATES.includes(templateTypeName)) {
        const error = new Error('必須テンプレートは削除できません') as any;
        error.statusCode = 409;
        error.code = TEMPLATE_CONSTANTS.ERROR_CODES.TEMPLATE_DELETE_CONFLICT;
        error.details = {
          template_id: id,
          template_type: templateTypeName,
          suggestion: `${templateTypeName}テンプレートは各プライズに必須です`,
        };
        throw error;
      }

      // Count related data before deletion
      const nodesCount = await InInstantwinNode.count({ where: { template_id: id } });
      const edgesCount = await InInstantwinEdge.count({
        where: {
          [Op.or]: [
            { '$sourceNode.template_id$': id },
            { '$targetNode.template_id$': id },
          ],
        },
        include: [
          { model: InInstantwinNode, as: 'sourceNode', attributes: [] },
          { model: InInstantwinNode, as: 'targetNode', attributes: [] },
        ],
      });

      // Get node IDs for counting messages and select options
      const nodeIds = await InInstantwinNode.findAll({
        where: { template_id: id },
        attributes: ['id'],
        raw: true,
      }).then(nodes => nodes.map(node => node.id));

      const messagesCount = nodeIds.length > 0 ? await InInstantwinMessage.count({
        where: { node_id: { [Op.in]: nodeIds } }
      }) : 0;

      const selectOptionsCount = nodeIds.length > 0 ? await InInstantwinMessageSelectOption.count({
        where: { node_id: { [Op.in]: nodeIds } }
      }) : 0;

      // Delete related data in correct order
      if (nodeIds.length > 0) {
        await InInstantwinMessageSelectOption.destroy({ where: { node_id: { [Op.in]: nodeIds } } });
        await InInstantwinMessage.destroy({ where: { node_id: { [Op.in]: nodeIds } } });
        await InInstantwinEdge.destroy({
          where: {
            [Op.or]: [
              { source_node_id: { [Op.in]: nodeIds } },
              { target_node_id: { [Op.in]: nodeIds } },
            ],
          },
        });
      }
      await InInstantwinNode.destroy({ where: { template_id: id } });

      // Delete the template
      const stepOrder = template.step_order;
      const prizeId = template.prize_id;
      await template.destroy();

      // Adjust step order of remaining templates
      await InInstantwinTemplate.update(
        { step_order: InInstantwinTemplate.sequelize!.literal('step_order - 1') },
        {
          where: {
            prize_id: prizeId,
            step_order: { [Op.gt]: stepOrder },
          },
        }
      );

      logger.info('テンプレートが削除されました:', {
        id,
        name: template.name,
        related_data: { nodesCount, edgesCount, messagesCount, selectOptionsCount },
      });

      return {
        nodes: nodesCount,
        edges: edgesCount,
        messages: messagesCount,
        select_options: selectOptionsCount,
      };
    } catch (error) {
      logger.error('テンプレート削除エラー:', error);
      throw error;
    }
  }
}

export default InInstantwinTemplateService;