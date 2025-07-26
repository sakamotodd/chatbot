import { Sequelize, DataTypes, Model, Optional } from 'sequelize';

interface InInstantwinMessageSelectOptionAttributes {
  id: number;
  node_id: number;
  parent_node_id?: number;
  prize_id: number;
  select_option: string;
  option_value?: string;
  display_order: number;
  created: Date;
  modified: Date;
}

interface InInstantwinMessageSelectOptionCreationAttributes extends Optional<InInstantwinMessageSelectOptionAttributes, 'id' | 'created' | 'modified'> {}

class InInstantwinMessageSelectOption extends Model<InInstantwinMessageSelectOptionAttributes, InInstantwinMessageSelectOptionCreationAttributes> implements InInstantwinMessageSelectOptionAttributes {
  public id!: number;
  public node_id!: number;
  public parent_node_id?: number;
  public prize_id!: number;
  public select_option!: string;
  public option_value?: string;
  public display_order!: number;
  public created!: Date;
  public modified!: Date;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export function createInInstantwinMessageSelectOptionModel(sequelize: Sequelize, dataTypes: typeof DataTypes) {
  InInstantwinMessageSelectOption.init(
    {
      id: {
        type: dataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
      },
      node_id: {
        type: dataTypes.BIGINT,
        allowNull: false,
        references: {
          model: 'in_instantwin_nodes',
          key: 'id',
        },
      },
      parent_node_id: {
        type: dataTypes.BIGINT,
        allowNull: true,
        references: {
          model: 'in_instantwin_nodes',
          key: 'id',
        },
      },
      prize_id: {
        type: dataTypes.BIGINT,
        allowNull: false,
        references: {
          model: 'in_instantwin_prizes',
          key: 'id',
        },
      },
      select_option: {
        type: dataTypes.STRING(255),
        allowNull: false,
      },
      option_value: {
        type: dataTypes.STRING(255),
        allowNull: true,
      },
      display_order: {
        type: dataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      created: {
        type: dataTypes.DATE,
        allowNull: false,
        defaultValue: dataTypes.NOW,
      },
      modified: {
        type: dataTypes.DATE,
        allowNull: false,
        defaultValue: dataTypes.NOW,
      },
    },
    {
      sequelize,
      tableName: 'in_instantwin_message_select_options',
      timestamps: false,
      hooks: {
        beforeUpdate: (option: InInstantwinMessageSelectOption) => {
          option.modified = new Date();
        },
      },
    }
  );

  return InInstantwinMessageSelectOption;
}

export { InInstantwinMessageSelectOption };
export type { InInstantwinMessageSelectOptionAttributes, InInstantwinMessageSelectOptionCreationAttributes };