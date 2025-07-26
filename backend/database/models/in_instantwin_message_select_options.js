"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InInstantwinMessageSelectOption = void 0;
exports.createInInstantwinMessageSelectOptionModel = createInInstantwinMessageSelectOptionModel;
const sequelize_1 = require("sequelize");
class InInstantwinMessageSelectOption extends sequelize_1.Model {
}
exports.InInstantwinMessageSelectOption = InInstantwinMessageSelectOption;
function createInInstantwinMessageSelectOptionModel(sequelize, dataTypes) {
    InInstantwinMessageSelectOption.init({
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
        parent_node_id: {
            type: dataTypes.BIGINT,
            allowNull: true,
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
        select_option: {
            type: dataTypes.STRING(255),
            allowNull: false,
        },
        option_value: {
            type: dataTypes.STRING(255),
            allowNull: true,
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
        tableName: 'in_instantwin_message_select_options',
        timestamps: false,
        hooks: {
            beforeUpdate: (option) => {
                option.modified = new Date();
            },
        },
    });
    return InInstantwinMessageSelectOption;
}
