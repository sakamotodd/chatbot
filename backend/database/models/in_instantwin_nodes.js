"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InInstantwinNode = exports.NodeType = void 0;
exports.createInInstantwinNodeModel = createInInstantwinNodeModel;
const sequelize_1 = require("sequelize");
var NodeType;
(function (NodeType) {
    NodeType[NodeType["FIRST_TRIGGER"] = 0] = "FIRST_TRIGGER";
    NodeType[NodeType["MESSAGE"] = 1] = "MESSAGE";
    NodeType[NodeType["MESSAGE_SELECT_OPTION"] = 2] = "MESSAGE_SELECT_OPTION";
    NodeType[NodeType["LOTTERY"] = 3] = "LOTTERY";
    NodeType[NodeType["LOTTERY_MESSAGE"] = 4] = "LOTTERY_MESSAGE";
})(NodeType || (exports.NodeType = NodeType = {}));
class InInstantwinNode extends sequelize_1.Model {
}
exports.InInstantwinNode = InInstantwinNode;
function createInInstantwinNodeModel(sequelize, dataTypes) {
    InInstantwinNode.init({
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
        type: {
            type: dataTypes.INTEGER,
            allowNull: false,
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
        tableName: 'in_instantwin_nodes',
        timestamps: false,
        hooks: {
            beforeUpdate: (node) => {
                node.modified = new Date();
            },
        },
    });
    return InInstantwinNode;
}
