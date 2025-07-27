import { Sequelize, DataTypes, Model, Optional } from 'sequelize';

interface InInstantwinLotteryHistoryAttributes {
  id: number;
  conversation_id: number;
  user_id: string;
  prize_id: number;
  is_winner: boolean;
  lottery_datetime: Date;
  result_data?: object;
  created: Date;
  modified: Date;
}

interface InInstantwinLotteryHistoryCreationAttributes extends Optional<InInstantwinLotteryHistoryAttributes, 'id' | 'created' | 'modified'> {}

class InInstantwinLotteryHistory extends Model<InInstantwinLotteryHistoryAttributes, InInstantwinLotteryHistoryCreationAttributes> implements InInstantwinLotteryHistoryAttributes {
  public id!: number;
  public conversation_id!: number;
  public user_id!: string;
  public prize_id!: number;
  public is_winner!: boolean;
  public lottery_datetime!: Date;
  public result_data?: object;
  public created!: Date;
  public modified!: Date;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export function createInInstantwinLotteryHistoryModel(sequelize: Sequelize, dataTypes: typeof DataTypes) {
  InInstantwinLotteryHistory.init(
    {
      id: {
        type: dataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
      },
      conversation_id: {
        type: dataTypes.BIGINT,
        allowNull: false,
        references: {
          model: 'in_instantwin_conversations',
          key: 'id',
        },
      },
      user_id: {
        type: dataTypes.STRING(255),
        allowNull: false,
      },
      prize_id: {
        type: dataTypes.BIGINT,
        allowNull: false,
        references: {
          model: 'in_instantwin_prizes',
          key: 'id',
        },
      },
      is_winner: {
        type: dataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      lottery_datetime: {
        type: dataTypes.DATE,
        allowNull: false,
      },
      result_data: {
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
      tableName: 'in_instantwin_lottery_histories',
      timestamps: false,
      hooks: {
        beforeUpdate: (history: InInstantwinLotteryHistory) => {
          history.modified = new Date();
        },
      },
    }
  );

  return InInstantwinLotteryHistory;
}

export { InInstantwinLotteryHistory };
export type { InInstantwinLotteryHistoryAttributes, InInstantwinLotteryHistoryCreationAttributes };