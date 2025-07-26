import { Sequelize, DataTypes, Model, Optional } from 'sequelize';

export enum NodeType {
  FIRST_TRIGGER = 0,
  MESSAGE = 1,
  MESSAGE_SELECT_OPTION = 2,
  LOTTERY = 3,
  LOTTERY_MESSAGE = 4,
}

interface InInstantwinNodeAttributes {
  id: number;
  template_id: number;
  prize_id: number;
  type: NodeType;
  created: Date;
  modified: Date;
}

interface InInstantwinNodeCreationAttributes extends Optional<InInstantwinNodeAttributes, 'id' | 'created' | 'modified'> {}

class InInstantwinNode extends Model<InInstantwinNodeAttributes, InInstantwinNodeCreationAttributes> implements InInstantwinNodeAttributes {
  public id!: number;
  public template_id!: number;
  public prize_id!: number;
  public type!: NodeType;
  public created!: Date;
  public modified!: Date;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export function createInInstantwinNodeModel(sequelize: Sequelize, dataTypes: typeof DataTypes) {
  InInstantwinNode.init(
    {
      id: {
        type: dataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
      },
      template_id: {
        type: dataTypes.BIGINT,
        allowNull: false,
        references: {
          model: 'in_instantwin_templates',
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
      type: {
        type: dataTypes.INTEGER,
        allowNull: false,
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
      tableName: 'in_instantwin_nodes',
      timestamps: false,
      hooks: {
        beforeUpdate: (node: InInstantwinNode) => {
          node.modified = new Date();
        },
      },
    }
  );

  return InInstantwinNode;
}

export { InInstantwinNode };
export type { InInstantwinNodeAttributes, InInstantwinNodeCreationAttributes };