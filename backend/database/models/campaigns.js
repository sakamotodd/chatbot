"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Campaign = void 0;
exports.createCampaignModel = createCampaignModel;
const sequelize_1 = require("sequelize");
class Campaign extends sequelize_1.Model {
}
exports.Campaign = Campaign;
function createCampaignModel(sequelize, dataTypes) {
    Campaign.init({
        id: {
            type: dataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true,
        },
        title: {
            type: dataTypes.STRING(255),
            allowNull: false,
        },
        description: {
            type: dataTypes.TEXT,
            allowNull: true,
        },
        status: {
            type: dataTypes.STRING(50),
            allowNull: false,
            defaultValue: 'draft',
        },
        start_date: {
            type: dataTypes.DATE,
            allowNull: true,
        },
        end_date: {
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
        tableName: 'campaigns',
        timestamps: false,
        hooks: {
            beforeUpdate: (campaign) => {
                campaign.modified = new Date();
            },
        },
    });
    return Campaign;
}
