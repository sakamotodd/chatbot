import { Sequelize, DataTypes, Model, Optional } from 'sequelize';

interface InInstantwinMessageCardAttributes {
  id: number;
  message_id: number;
  prize_id: number;
  title: string;
  subtitle?: string;
  image_url?: string;
  card_url?: string;
  created: Date;
  modified: Date;
}

interface InInstantwinMessageCardCreationAttributes extends Optional<InInstantwinMessageCardAttributes, 'id' | 'created' | 'modified'> {}

class InInstantwinMessageCard extends Model<InInstantwinMessageCardAttributes, InInstantwinMessageCardCreationAttributes> implements InInstantwinMessageCardAttributes {
  public id!: number;
  public message_id!: number;
  public prize_id!: number;
  public title!: string;
  public subtitle?: string;
  public image_url?: string;
  public card_url?: string;
  public created!: Date;
  public modified!: Date;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export function createInInstantwinMessageCardModel(sequelize: Sequelize, dataTypes: typeof DataTypes) {
  InInstantwinMessageCard.init(
    {
      id: {
        type: dataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
      },
      message_id: {
        type: dataTypes.BIGINT,
        allowNull: false,
        references: {
          model: 'in_instantwin_messages',
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
      title: {
        type: dataTypes.STRING(255),
        allowNull: false,
      },
      subtitle: {
        type: dataTypes.STRING(500),
        allowNull: true,
      },
      image_url: {
        type: dataTypes.STRING(500),
        allowNull: true,
      },
      card_url: {
        type: dataTypes.STRING(500),
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
      tableName: 'in_instantwin_message_cards',
      timestamps: false,
      hooks: {
        beforeUpdate: (card: InInstantwinMessageCard) => {
          card.modified = new Date();
        },
      },
    }
  );

  return InInstantwinMessageCard;
}

export { InInstantwinMessageCard };
export type { InInstantwinMessageCardAttributes, InInstantwinMessageCardCreationAttributes };