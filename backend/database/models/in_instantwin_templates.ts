import { Sequelize, DataTypes, Model, Optional } from 'sequelize';

export enum TemplateType {
  START = 0,
  MESSAGE = 1,
  TREE = 2,
  LOTTERY_GROUP = 3,
  END = 4,
}

interface InInstantwinTemplateAttributes {
  id: number;
  prize_id: number;
  name?: string;
  type: TemplateType;
  step_order: number;
  is_active: boolean;
  created: Date;
  modified: Date;
}

interface InInstantwinTemplateCreationAttributes extends Optional<InInstantwinTemplateAttributes, 'id' | 'created' | 'modified'> {}

class InInstantwinTemplate extends Model<InInstantwinTemplateAttributes, InInstantwinTemplateCreationAttributes> implements InInstantwinTemplateAttributes {
  public id!: number;
  public prize_id!: number;
  public name?: string;
  public type!: TemplateType;
  public step_order!: number;
  public is_active!: boolean;
  public created!: Date;
  public modified!: Date;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export function createInInstantwinTemplateModel(sequelize: Sequelize, dataTypes: typeof DataTypes) {
  InInstantwinTemplate.init(
    {
      id: {
        type: dataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
      },
      prize_id: {
        type: dataTypes.BIGINT,
        allowNull: false,
        references: {
          model: 'in_instantwin_prizes',
          key: 'id',
        },
      },
      name: {
        type: dataTypes.STRING(120),
        allowNull: true,
      },
      type: {
        type: dataTypes.INTEGER,
        allowNull: false,
      },
      step_order: {
        type: dataTypes.INTEGER,
        allowNull: false,
      },
      is_active: {
        type: dataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
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
      tableName: 'in_instantwin_templates',
      timestamps: false,
      hooks: {
        beforeUpdate: (template: InInstantwinTemplate) => {
          template.modified = new Date();
        },
      },
    }
  );

  return InInstantwinTemplate;
}

export { InInstantwinTemplate };
export type { InInstantwinTemplateAttributes, InInstantwinTemplateCreationAttributes };