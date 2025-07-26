"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InInstantwinTemplate = exports.TemplateType = void 0;
exports.createInInstantwinTemplateModel = createInInstantwinTemplateModel;
const sequelize_1 = require("sequelize");
var TemplateType;
(function (TemplateType) {
    TemplateType[TemplateType["START"] = 0] = "START";
    TemplateType[TemplateType["MESSAGE"] = 1] = "MESSAGE";
    TemplateType[TemplateType["TREE"] = 2] = "TREE";
    TemplateType[TemplateType["LOTTERY_GROUP"] = 3] = "LOTTERY_GROUP";
    TemplateType[TemplateType["END"] = 4] = "END";
})(TemplateType || (exports.TemplateType = TemplateType = {}));
class InInstantwinTemplate extends sequelize_1.Model {
}
exports.InInstantwinTemplate = InInstantwinTemplate;
function createInInstantwinTemplateModel(sequelize, dataTypes) {
    InInstantwinTemplate.init({
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
        name: {
            type: dataTypes.STRING(120),
            allowNull: true,
        },
        type: {
            type: dataTypes.INTEGER,
            allowNull: false,
        },
        step_order: {
            type: dataTypes.INTEGER,
            allowNull: false,
        },
        is_active: {
            type: dataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
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
        tableName: 'in_instantwin_templates',
        timestamps: false,
        hooks: {
            beforeUpdate: (template) => {
                template.modified = new Date();
            },
        },
    });
    return InInstantwinTemplate;
}
