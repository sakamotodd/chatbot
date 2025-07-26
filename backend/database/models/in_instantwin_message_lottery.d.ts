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
interface InInstantwinMessageLotteryCreationAttributes extends Optional<InInstantwinMessageLotteryAttributes, 'id' | 'created' | 'modified'> {
}
declare class InInstantwinMessageLottery extends Model<InInstantwinMessageLotteryAttributes, InInstantwinMessageLotteryCreationAttributes> implements InInstantwinMessageLotteryAttributes {
    id: number;
    prize_id: number;
    node_id: number;
    message_id?: number;
    is_win: boolean;
    created: Date;
    modified: Date;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
export declare function createInInstantwinMessageLotteryModel(sequelize: Sequelize, dataTypes: typeof DataTypes): typeof InInstantwinMessageLottery;
export { InInstantwinMessageLottery, InInstantwinMessageLotteryAttributes, InInstantwinMessageLotteryCreationAttributes };
