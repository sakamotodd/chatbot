import { Sequelize, DataTypes, Model, Optional } from 'sequelize';

export enum MessageType {
  TEXT = 0,
  MEDIA = 1,
  CARD = 2,
  SELECT = 3,
}

interface InInstantwinMessageAttributes {
  id: number;
  node_id: number;
  prize_id: number;
  text?: string;
  message_type: MessageType;
  media_id?: number;
  media_url?: string;
  metadata?: object;
  created: Date;
  modified: Date;
}

interface InInstantwinMessageCreationAttributes extends Optional<InInstantwinMessageAttributes, 'id' | 'created' | 'modified'> {}

class InInstantwinMessage extends Model<InInstantwinMessageAttributes, InInstantwinMessageCreationAttributes> implements InInstantwinMessageAttributes {
  public id!: number;
  public node_id!: number;
  public prize_id!: number;
  public text?: string;
  public message_type!: MessageType;
  public media_id?: number;
  public media_url?: string;
  public metadata?: object;
  public created!: Date;
  public modified!: Date;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export function createInInstantwinMessageModel(sequelize: Sequelize, dataTypes: typeof DataTypes) {
  InInstantwinMessage.init(
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
      prize_id: {
        type: dataTypes.BIGINT,
        allowNull: false,
        references: {
          model: 'in_instantwin_prizes',
          key: 'id',
        },
      },
      text: {
        type: dataTypes.TEXT,
        allowNull: true,
      },
      message_type: {
        type: dataTypes.INTEGER,
        allowNull: false,
      },
      media_id: {
        type: dataTypes.BIGINT,
        allowNull: true,
      },
      media_url: {
        type: dataTypes.STRING(500),
        allowNull: true,
      },
      metadata: {
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
      tableName: 'in_instantwin_messages',
      timestamps: false,
      hooks: {
        beforeUpdate: (message: InInstantwinMessage) => {
          message.modified = new Date();
        },
      },
    }
  );

  return InInstantwinMessage;
}

export { InInstantwinMessage };
export type { InInstantwinMessageAttributes, InInstantwinMessageCreationAttributes };