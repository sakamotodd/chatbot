"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InInstantwinMessageLottery = void 0;
exports.createInInstantwinMessageLotteryModel = createInInstantwinMessageLotteryModel;
const sequelize_1 = require("sequelize");
class InInstantwinMessageLottery extends sequelize_1.Model {
}
exports.InInstantwinMessageLottery = InInstantwinMessageLottery;
function createInInstantwinMessageLotteryModel(sequelize, dataTypes) {
    InInstantwinMessageLottery.init({
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
    }, {
        sequelize,
        tableName: 'in_instantwin_message_lottery',
        timestamps: false,
        hooks: {
            beforeUpdate: (lottery) => {
                lottery.modified = new Date();
            },
        },
    });
    return InInstantwinMessageLottery;
}
