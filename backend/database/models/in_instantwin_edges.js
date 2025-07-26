"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InInstantwinEdge = void 0;
exports.createInInstantwinEdgeModel = createInInstantwinEdgeModel;
const sequelize_1 = require("sequelize");
class InInstantwinEdge extends sequelize_1.Model {
}
exports.InInstantwinEdge = InInstantwinEdge;
function createInInstantwinEdgeModel(sequelize, dataTypes) {
    InInstantwinEdge.init({
        id: {
            type: dataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true,
        },
        template_id: {
            type: dataTypes.BIGINT,
            allowNull: false,
            references: {
                model: 'in_instantwin_templates',
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
        source_node_id: {
            type: dataTypes.BIGINT,
            allowNull: false,
            references: {
                model: 'in_instantwin_nodes',
                key: 'id',
            },
        },
        target_node_id: {
            type: dataTypes.BIGINT,
            allowNull: false,
            references: {
                model: 'in_instantwin_nodes',
                key: 'id',
            },
        },
        condition_data: {
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
        tableName: 'in_instantwin_edges',
        timestamps: false,
        hooks: {
            beforeUpdate: (edge) => {
                edge.modified = new Date();
            },
        },
    });
    return InInstantwinEdge;
}
