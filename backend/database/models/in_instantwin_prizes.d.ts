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
interface InInstantwinPrizeCreationAttributes extends Optional<InInstantwinPrizeAttributes, 'id' | 'created' | 'modified'> {
}
declare class InInstantwinPrize extends Model<InInstantwinPrizeAttributes, InInstantwinPrizeCreationAttributes> implements InInstantwinPrizeAttributes {
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
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
export declare function createInInstantwinPrizeModel(sequelize: Sequelize, dataTypes: typeof DataTypes): typeof InInstantwinPrize;
export { InInstantwinPrize, InInstantwinPrizeAttributes, InInstantwinPrizeCreationAttributes };
