import { Sequelize, DataTypes, Model, Optional } from 'sequelize';

interface InInstantwinMessageLotteryAttributes {
  id: number;
  prize_id: number;
  node_id: number;
  message_id?: number;
  is_win: boolean;
  created: Date;
  modified: Date;
}

interface InInstantwinMessageLotteryCreationAttributes extends Optional<InInstantwinMessageLotteryAttributes, 'id' | 'created' | 'modified'> {}

class InInstantwinMessageLottery extends Model<InInstantwinMessageLotteryAttributes, InInstantwinMessageLotteryCreationAttributes> implements InInstantwinMessageLotteryAttributes {
  public id!: number;
  public prize_id!: number;
  public node_id!: number;
  public message_id?: number;
  public is_win!: boolean;
  public created!: Date;
  public modified!: Date;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export function createInInstantwinMessageLotteryModel(sequelize: Sequelize, dataTypes: typeof DataTypes) {
  InInstantwinMessageLottery.init(
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
      node_id: {
        type: dataTypes.BIGINT,
        allowNull: false,
        references: {
          model: 'in_instantwin_nodes',
          key: 'id',
        },
      },
      message_id: {
        type: dataTypes.BIGINT,
        allowNull: true,
        references: {
          model: 'in_instantwin_messages',
          key: 'id',
        },
      },
      is_win: {
        type: dataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
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
      tableName: 'in_instantwin_message_lottery',
      timestamps: false,
      hooks: {
        beforeUpdate: (lottery: InInstantwinMessageLottery) => {
          lottery.modified = new Date();
        },
      },
    }
  );

  return InInstantwinMessageLottery;
}

export { InInstantwinMessageLottery };
export type { InInstantwinMessageLotteryAttributes, InInstantwinMessageLotteryCreationAttributes };