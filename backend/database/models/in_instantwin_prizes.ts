import { Sequelize, DataTypes, Model, Optional } from 'sequelize';

interface InInstantwinPrizeAttributes {
  id: number;
  campaign_id: number;
  name: string;
  description?: string;
  send_winner_count: number;
  winner_count: number;
  winning_rate_change_type: number;
  winning_rate: number;
  daily_winner_count?: number;
  is_daily_lottery: boolean;
  lottery_count_per_minute?: number;
  lottery_count_per_minute_updated_datetime?: Date;
  created: Date;
  modified: Date;
}

interface InInstantwinPrizeCreationAttributes extends Optional<InInstantwinPrizeAttributes, 'id' | 'created' | 'modified'> {}

class InInstantwinPrize extends Model<InInstantwinPrizeAttributes, InInstantwinPrizeCreationAttributes> implements InInstantwinPrizeAttributes {
  public id!: number;
  public campaign_id!: number;
  public name!: string;
  public description?: string;
  public send_winner_count!: number;
  public winner_count!: number;
  public winning_rate_change_type!: number;
  public winning_rate!: number;
  public daily_winner_count?: number;
  public is_daily_lottery!: boolean;
  public lottery_count_per_minute?: number;
  public lottery_count_per_minute_updated_datetime?: Date;
  public created!: Date;
  public modified!: Date;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export function createInInstantwinPrizeModel(sequelize: Sequelize, dataTypes: typeof DataTypes) {
  InInstantwinPrize.init(
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
      name: {
        type: dataTypes.STRING(255),
        allowNull: false,
      },
      description: {
        type: dataTypes.TEXT,
        allowNull: true,
      },
      send_winner_count: {
        type: dataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      winner_count: {
        type: dataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      winning_rate_change_type: {
        type: dataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      winning_rate: {
        type: dataTypes.DECIMAL(10, 4),
        allowNull: false,
        defaultValue: 0.0000,
      },
      daily_winner_count: {
        type: dataTypes.INTEGER,
        allowNull: true,
      },
      is_daily_lottery: {
        type: dataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      lottery_count_per_minute: {
        type: dataTypes.INTEGER,
        allowNull: true,
      },
      lottery_count_per_minute_updated_datetime: {
        type: dataTypes.DATE,
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
      tableName: 'in_instantwin_prizes',
      timestamps: false,
      hooks: {
        beforeUpdate: (prize: InInstantwinPrize) => {
          prize.modified = new Date();
        },
      },
    }
  );

  return InInstantwinPrize;
}

export { InInstantwinPrize };
export type { InInstantwinPrizeAttributes, InInstantwinPrizeCreationAttributes };