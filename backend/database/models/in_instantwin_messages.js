"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InInstantwinMessage = exports.MessageType = void 0;
exports.createInInstantwinMessageModel = createInInstantwinMessageModel;
const sequelize_1 = require("sequelize");
var MessageType;
(function (MessageType) {
    MessageType[MessageType["TEXT"] = 0] = "TEXT";
    MessageType[MessageType["MEDIA"] = 1] = "MEDIA";
    MessageType[MessageType["CARD"] = 2] = "CARD";
    MessageType[MessageType["SELECT"] = 3] = "SELECT";
})(MessageType || (exports.MessageType = MessageType = {}));
class InInstantwinMessage extends sequelize_1.Model {
}
exports.InInstantwinMessage = InInstantwinMessage;
function createInInstantwinMessageModel(sequelize, dataTypes) {
    InInstantwinMessage.init({
        id: {
            type: dataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true,
        },
        node_id: {
            type: dataTypes.BIGINT,
            allowNull: false,
            references: {
                model: 'in_instantwin_nodes',
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
        text: {
            type: dataTypes.TEXT,
            allowNull: true,
        },
        message_type: {
            type: dataTypes.INTEGER,
            allowNull: false,
        },
        media_id: {
            type: dataTypes.BIGINT,
            allowNull: true,
        },
        media_url: {
            type: dataTypes.STRING(500),
            allowNull: true,
        },
        metadata: {
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
    }, {
        sequelize,
        tableName: 'in_instantwin_messages',
        timestamps: false,
        hooks: {
            beforeUpdate: (message) => {
                message.modified = new Date();
            },
        },
    });
    return InInstantwinMessage;
}
