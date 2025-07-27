import { Sequelize, DataTypes, Model, Optional } from 'sequelize';

interface InInstantwinConversationAttributes {
  id: number;
  campaign_id: number;
  prize_id: number;
  template_id?: number;
  current_node_id?: number;
  instagram_user_id: string;
  user_id?: string;
  status?: string;
  metadata?: object;
  sender_id?: number;
  message_text?: string;
  message_timestamp: Date;
  is_from_user: boolean;
  is_first_trigger: boolean;
  is_last_trigger: boolean;
  session_data?: object;
  created: Date;
  modified: Date;
}

interface InInstantwinConversationCreationAttributes extends Optional<InInstantwinConversationAttributes, 'id' | 'created' | 'modified'> {}

class InInstantwinConversation extends Model<InInstantwinConversationAttributes, InInstantwinConversationCreationAttributes> implements InInstantwinConversationAttributes {
  public id!: number;
  public campaign_id!: number;
  public prize_id!: number;
  public template_id?: number;
  public current_node_id?: number;
  public instagram_user_id!: string;
  public user_id?: string;
  public status?: string;
  public metadata?: object;
  public sender_id?: number;
  public message_text?: string;
  public message_timestamp!: Date;
  public is_from_user!: boolean;
  public is_first_trigger!: boolean;
  public is_last_trigger!: boolean;
  public session_data?: object;
  public created!: Date;
  public modified!: Date;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export function createInInstantwinConversationModel(sequelize: Sequelize, dataTypes: typeof DataTypes) {
  InInstantwinConversation.init(
    {
      id: {
        type: dataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
      },
      campaign_id: {
        type: dataTypes.BIGINT,
        allowNull: false,
        references: {
          model: 'campaigns',
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
      template_id: {
        type: dataTypes.BIGINT,
        allowNull: true,
        references: {
          model: 'in_instantwin_templates',
          key: 'id',
        },
      },
      current_node_id: {
        type: dataTypes.BIGINT,
        allowNull: true,
        references: {
          model: 'in_instantwin_nodes',
          key: 'id',
        },
      },
      instagram_user_id: {
        type: dataTypes.STRING(255),
        allowNull: false,
      },
      sender_id: {
        type: dataTypes.BIGINT,
        allowNull: true,
      },
      message_text: {
        type: dataTypes.TEXT,
        allowNull: true,
      },
      message_timestamp: {
        type: dataTypes.DATE,
        allowNull: false,
        defaultValue: dataTypes.NOW,
      },
      is_from_user: {
        type: dataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      is_first_trigger: {
        type: dataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      is_last_trigger: {
        type: dataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      session_data: {
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
      tableName: 'in_instantwin_conversations',
      timestamps: false,
      hooks: {
        beforeUpdate: (conversation: InInstantwinConversation) => {
          conversation.modified = new Date();
        },
      },
    }
  );

  return InInstantwinConversation;
}

export { InInstantwinConversation };
export type { InInstantwinConversationAttributes, InInstantwinConversationCreationAttributes };