"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InInstantwinPrize = void 0;
exports.createInInstantwinPrizeModel = createInInstantwinPrizeModel;
const sequelize_1 = require("sequelize");
class InInstantwinPrize extends sequelize_1.Model {
}
exports.InInstantwinPrize = InInstantwinPrize;
function createInInstantwinPrizeModel(sequelize, dataTypes) {
    InInstantwinPrize.init({
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
    }, {
        sequelize,
        tableName: 'in_instantwin_prizes',
        timestamps: false,
        hooks: {
            beforeUpdate: (prize) => {
                prize.modified = new Date();
            },
        },
    });
    return InInstantwinPrize;
}
