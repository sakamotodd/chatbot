import { Sequelize, DataTypes, Model, Optional } from 'sequelize';

interface InInstantwinMessageCardButtonAttributes {
  id: number;
  message_card_id: number;
  button_title: string;
  button_url?: string;
  button_type: string;
  display_order: number;
  created: Date;
  modified: Date;
}

interface InInstantwinMessageCardButtonCreationAttributes extends Optional<InInstantwinMessageCardButtonAttributes, 'id' | 'created' | 'modified'> {}

class InInstantwinMessageCardButton extends Model<InInstantwinMessageCardButtonAttributes, InInstantwinMessageCardButtonCreationAttributes> implements InInstantwinMessageCardButtonAttributes {
  public id!: number;
  public message_card_id!: number;
  public button_title!: string;
  public button_url?: string;
  public button_type!: string;
  public display_order!: number;
  public created!: Date;
  public modified!: Date;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export function createInInstantwinMessageCardButtonModel(sequelize: Sequelize, dataTypes: typeof DataTypes) {
  InInstantwinMessageCardButton.init(
    {
      id: {
        type: dataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
      },
      message_card_id: {
        type: dataTypes.BIGINT,
        allowNull: false,
        references: {
          model: 'in_instantwin_message_cards',
          key: 'id',
        },
      },
      button_title: {
        type: dataTypes.STRING(255),
        allowNull: false,
      },
      button_url: {
        type: dataTypes.STRING(500),
        allowNull: true,
      },
      button_type: {
        type: dataTypes.STRING(50),
        allowNull: false,
        defaultValue: 'url',
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
      tableName: 'in_instantwin_message_card_buttons',
      timestamps: false,
      hooks: {
        beforeUpdate: (button: InInstantwinMessageCardButton) => {
          button.modified = new Date();
        },
      },
    }
  );

  return InInstantwinMessageCardButton;
}

export { InInstantwinMessageCardButton };
export type { InInstantwinMessageCardButtonAttributes, InInstantwinMessageCardButtonCreationAttributes };