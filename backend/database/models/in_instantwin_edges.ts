import { Sequelize, DataTypes, Model, Optional } from 'sequelize';

interface InInstantwinEdgeAttributes {
  id: number;
  template_id: number;
  prize_id: number;
  source_node_id: number;
  target_node_id: number;
  condition_data?: object;
  created: Date;
  modified: Date;
}

interface InInstantwinEdgeCreationAttributes extends Optional<InInstantwinEdgeAttributes, 'id' | 'created' | 'modified'> {}

class InInstantwinEdge extends Model<InInstantwinEdgeAttributes, InInstantwinEdgeCreationAttributes> implements InInstantwinEdgeAttributes {
  public id!: number;
  public template_id!: number;
  public prize_id!: number;
  public source_node_id!: number;
  public target_node_id!: number;
  public condition_data?: object;
  public created!: Date;
  public modified!: Date;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export function createInInstantwinEdgeModel(sequelize: Sequelize, dataTypes: typeof DataTypes) {
  InInstantwinEdge.init(
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
      source_node_id: {
        type: dataTypes.BIGINT,
        allowNull: false,
        references: {
          model: 'in_instantwin_nodes',
          key: 'id',
        },
      },
      target_node_id: {
        type: dataTypes.BIGINT,
        allowNull: false,
        references: {
          model: 'in_instantwin_nodes',
          key: 'id',
        },
      },
      condition_data: {
        type: dataTypes.JSON,
        allowNull: true,
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
      tableName: 'in_instantwin_edges',
      timestamps: false,
      hooks: {
        beforeUpdate: (edge: InInstantwinEdge) => {
          edge.modified = new Date();
        },
      },
    }
  );

  return InInstantwinEdge;
}

export { InInstantwinEdge };
export type { InInstantwinEdgeAttributes, InInstantwinEdgeCreationAttributes };