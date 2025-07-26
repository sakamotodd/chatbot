"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InInstantwinMessageCard = void 0;
exports.createInInstantwinMessageCardModel = createInInstantwinMessageCardModel;
const sequelize_1 = require("sequelize");
class InInstantwinMessageCard extends sequelize_1.Model {
}
exports.InInstantwinMessageCard = InInstantwinMessageCard;
function createInInstantwinMessageCardModel(sequelize, dataTypes) {
    InInstantwinMessageCard.init({
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
    }, {
        sequelize,
        tableName: 'in_instantwin_message_cards',
        timestamps: false,
        hooks: {
            beforeUpdate: (card) => {
                card.modified = new Date();
            },
        },
    });
    return InInstantwinMessageCard;
}
