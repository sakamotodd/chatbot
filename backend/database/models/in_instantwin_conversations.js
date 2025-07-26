"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InInstantwinConversation = void 0;
exports.createInInstantwinConversationModel = createInInstantwinConversationModel;
const sequelize_1 = require("sequelize");
class InInstantwinConversation extends sequelize_1.Model {
}
exports.InInstantwinConversation = InInstantwinConversation;
function createInInstantwinConversationModel(sequelize, dataTypes) {
    InInstantwinConversation.init({
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
        prize_id: {
            type: dataTypes.BIGINT,
            allowNull: false,
            references: {
                model: 'in_instantwin_prizes',
                key: 'id',
            },
        },
        template_id: {
            type: dataTypes.BIGINT,
            allowNull: true,
            references: {
                model: 'in_instantwin_templates',
                key: 'id',
            },
        },
        current_node_id: {
            type: dataTypes.BIGINT,
            allowNull: true,
            references: {
                model: 'in_instantwin_nodes',
                key: 'id',
            },
        },
        instagram_user_id: {
            type: dataTypes.STRING(255),
            allowNull: false,
        },
        sender_id: {
            type: dataTypes.BIGINT,
            allowNull: true,
        },
        message_text: {
            type: dataTypes.TEXT,
            allowNull: true,
        },
        message_timestamp: {
            type: dataTypes.DATE,
            allowNull: false,
            defaultValue: dataTypes.NOW,
        },
        is_from_user: {
            type: dataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
        is_first_trigger: {
            type: dataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        is_last_trigger: {
            type: dataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        session_data: {
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
        tableName: 'in_instantwin_conversations',
        timestamps: false,
        hooks: {
            beforeUpdate: (conversation) => {
                conversation.modified = new Date();
            },
        },
    });
    return InInstantwinConversation;
}
