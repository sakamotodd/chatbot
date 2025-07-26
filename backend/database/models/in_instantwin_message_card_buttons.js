"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InInstantwinMessageCardButton = void 0;
exports.createInInstantwinMessageCardButtonModel = createInInstantwinMessageCardButtonModel;
const sequelize_1 = require("sequelize");
class InInstantwinMessageCardButton extends sequelize_1.Model {
}
exports.InInstantwinMessageCardButton = InInstantwinMessageCardButton;
function createInInstantwinMessageCardButtonModel(sequelize, dataTypes) {
    InInstantwinMessageCardButton.init({
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
    }, {
        sequelize,
        tableName: 'in_instantwin_message_card_buttons',
        timestamps: false,
        hooks: {
            beforeUpdate: (button) => {
                button.modified = new Date();
            },
        },
    });
    return InInstantwinMessageCardButton;
}
