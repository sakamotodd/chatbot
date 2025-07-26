"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InInstantwinMessageLottery = exports.InInstantwinConversation = exports.InInstantwinMessageCardButton = exports.InInstantwinMessageCard = exports.InInstantwinMessageSelectOption = exports.InInstantwinMessage = exports.InInstantwinEdge = exports.InInstantwinNode = exports.InInstantwinTemplate = exports.InInstantwinPrize = exports.Campaign = exports.sequelize = void 0;
const sequelize_1 = require("sequelize");
const campaigns_1 = require("./campaigns");
const in_instantwin_prizes_1 = require("./in_instantwin_prizes");
const in_instantwin_templates_1 = require("./in_instantwin_templates");
const in_instantwin_nodes_1 = require("./in_instantwin_nodes");
const in_instantwin_edges_1 = require("./in_instantwin_edges");
const in_instantwin_messages_1 = require("./in_instantwin_messages");
const in_instantwin_message_select_options_1 = require("./in_instantwin_message_select_options");
const in_instantwin_message_cards_1 = require("./in_instantwin_message_cards");
const in_instantwin_message_card_buttons_1 = require("./in_instantwin_message_card_buttons");
const in_instantwin_conversations_1 = require("./in_instantwin_conversations");
const in_instantwin_message_lottery_1 = require("./in_instantwin_message_lottery");
const env = process.env.NODE_ENV || 'development';
const config = require('../config.js')[env];
let sequelize;
if (config.use_env_variable) {
    exports.sequelize = sequelize = new sequelize_1.Sequelize(process.env[config.use_env_variable], config);
}
else {
    exports.sequelize = sequelize = new sequelize_1.Sequelize(config.database, config.username, config.password, config);
}
// Initialize models
const Campaign = (0, campaigns_1.createCampaignModel)(sequelize, sequelize_1.DataTypes);
exports.Campaign = Campaign;
const InInstantwinPrize = (0, in_instantwin_prizes_1.createInInstantwinPrizeModel)(sequelize, sequelize_1.DataTypes);
exports.InInstantwinPrize = InInstantwinPrize;
const InInstantwinTemplate = (0, in_instantwin_templates_1.createInInstantwinTemplateModel)(sequelize, sequelize_1.DataTypes);
exports.InInstantwinTemplate = InInstantwinTemplate;
const InInstantwinNode = (0, in_instantwin_nodes_1.createInInstantwinNodeModel)(sequelize, sequelize_1.DataTypes);
exports.InInstantwinNode = InInstantwinNode;
const InInstantwinEdge = (0, in_instantwin_edges_1.createInInstantwinEdgeModel)(sequelize, sequelize_1.DataTypes);
exports.InInstantwinEdge = InInstantwinEdge;
const InInstantwinMessage = (0, in_instantwin_messages_1.createInInstantwinMessageModel)(sequelize, sequelize_1.DataTypes);
exports.InInstantwinMessage = InInstantwinMessage;
const InInstantwinMessageSelectOption = (0, in_instantwin_message_select_options_1.createInInstantwinMessageSelectOptionModel)(sequelize, sequelize_1.DataTypes);
exports.InInstantwinMessageSelectOption = InInstantwinMessageSelectOption;
const InInstantwinMessageCard = (0, in_instantwin_message_cards_1.createInInstantwinMessageCardModel)(sequelize, sequelize_1.DataTypes);
exports.InInstantwinMessageCard = InInstantwinMessageCard;
const InInstantwinMessageCardButton = (0, in_instantwin_message_card_buttons_1.createInInstantwinMessageCardButtonModel)(sequelize, sequelize_1.DataTypes);
exports.InInstantwinMessageCardButton = InInstantwinMessageCardButton;
const InInstantwinConversation = (0, in_instantwin_conversations_1.createInInstantwinConversationModel)(sequelize, sequelize_1.DataTypes);
exports.InInstantwinConversation = InInstantwinConversation;
const InInstantwinMessageLottery = (0, in_instantwin_message_lottery_1.createInInstantwinMessageLotteryModel)(sequelize, sequelize_1.DataTypes);
exports.InInstantwinMessageLottery = InInstantwinMessageLottery;
// Define associations
Campaign.hasMany(InInstantwinPrize, { foreignKey: 'campaign_id', as: 'prizes' });
InInstantwinPrize.belongsTo(Campaign, { foreignKey: 'campaign_id', as: 'campaign' });
InInstantwinPrize.hasMany(InInstantwinTemplate, { foreignKey: 'prize_id', as: 'templates' });
InInstantwinTemplate.belongsTo(InInstantwinPrize, { foreignKey: 'prize_id', as: 'prize' });
InInstantwinTemplate.hasMany(InInstantwinNode, { foreignKey: 'template_id', as: 'nodes' });
InInstantwinNode.belongsTo(InInstantwinTemplate, { foreignKey: 'template_id', as: 'template' });
InInstantwinPrize.hasMany(InInstantwinNode, { foreignKey: 'prize_id', as: 'nodes' });
InInstantwinNode.belongsTo(InInstantwinPrize, { foreignKey: 'prize_id', as: 'prize' });
InInstantwinTemplate.hasMany(InInstantwinEdge, { foreignKey: 'template_id', as: 'edges' });
InInstantwinEdge.belongsTo(InInstantwinTemplate, { foreignKey: 'template_id', as: 'template' });
InInstantwinPrize.hasMany(InInstantwinEdge, { foreignKey: 'prize_id', as: 'edges' });
InInstantwinEdge.belongsTo(InInstantwinPrize, { foreignKey: 'prize_id', as: 'prize' });
InInstantwinNode.hasMany(InInstantwinEdge, { foreignKey: 'source_node_id', as: 'outgoingEdges' });
InInstantwinNode.hasMany(InInstantwinEdge, { foreignKey: 'target_node_id', as: 'incomingEdges' });
InInstantwinEdge.belongsTo(InInstantwinNode, { foreignKey: 'source_node_id', as: 'sourceNode' });
InInstantwinEdge.belongsTo(InInstantwinNode, { foreignKey: 'target_node_id', as: 'targetNode' });
InInstantwinNode.hasMany(InInstantwinMessage, { foreignKey: 'node_id', as: 'messages' });
InInstantwinMessage.belongsTo(InInstantwinNode, { foreignKey: 'node_id', as: 'node' });
InInstantwinPrize.hasMany(InInstantwinMessage, { foreignKey: 'prize_id', as: 'messages' });
InInstantwinMessage.belongsTo(InInstantwinPrize, { foreignKey: 'prize_id', as: 'prize' });
InInstantwinNode.hasMany(InInstantwinMessageSelectOption, { foreignKey: 'node_id', as: 'selectOptions' });
InInstantwinMessageSelectOption.belongsTo(InInstantwinNode, { foreignKey: 'node_id', as: 'node' });
InInstantwinNode.hasMany(InInstantwinMessageSelectOption, { foreignKey: 'parent_node_id', as: 'parentSelectOptions' });
InInstantwinMessageSelectOption.belongsTo(InInstantwinNode, { foreignKey: 'parent_node_id', as: 'parentNode' });
InInstantwinPrize.hasMany(InInstantwinMessageSelectOption, { foreignKey: 'prize_id', as: 'selectOptions' });
InInstantwinMessageSelectOption.belongsTo(InInstantwinPrize, { foreignKey: 'prize_id', as: 'prize' });
InInstantwinMessage.hasMany(InInstantwinMessageCard, { foreignKey: 'message_id', as: 'cards' });
InInstantwinMessageCard.belongsTo(InInstantwinMessage, { foreignKey: 'message_id', as: 'message' });
InInstantwinPrize.hasMany(InInstantwinMessageCard, { foreignKey: 'prize_id', as: 'messageCards' });
InInstantwinMessageCard.belongsTo(InInstantwinPrize, { foreignKey: 'prize_id', as: 'prize' });
InInstantwinMessageCard.hasMany(InInstantwinMessageCardButton, { foreignKey: 'message_card_id', as: 'buttons' });
InInstantwinMessageCardButton.belongsTo(InInstantwinMessageCard, { foreignKey: 'message_card_id', as: 'messageCard' });
Campaign.hasMany(InInstantwinConversation, { foreignKey: 'campaign_id', as: 'conversations' });
InInstantwinConversation.belongsTo(Campaign, { foreignKey: 'campaign_id', as: 'campaign' });
InInstantwinPrize.hasMany(InInstantwinConversation, { foreignKey: 'prize_id', as: 'conversations' });
InInstantwinConversation.belongsTo(InInstantwinPrize, { foreignKey: 'prize_id', as: 'prize' });
InInstantwinTemplate.hasMany(InInstantwinConversation, { foreignKey: 'template_id', as: 'conversations' });
InInstantwinConversation.belongsTo(InInstantwinTemplate, { foreignKey: 'template_id', as: 'template' });
InInstantwinNode.hasMany(InInstantwinConversation, { foreignKey: 'current_node_id', as: 'conversations' });
InInstantwinConversation.belongsTo(InInstantwinNode, { foreignKey: 'current_node_id', as: 'currentNode' });
InInstantwinPrize.hasMany(InInstantwinMessageLottery, { foreignKey: 'prize_id', as: 'lotteryResults' });
InInstantwinMessageLottery.belongsTo(InInstantwinPrize, { foreignKey: 'prize_id', as: 'prize' });
InInstantwinNode.hasMany(InInstantwinMessageLottery, { foreignKey: 'node_id', as: 'lotteryResults' });
InInstantwinMessageLottery.belongsTo(InInstantwinNode, { foreignKey: 'node_id', as: 'node' });
InInstantwinMessage.hasMany(InInstantwinMessageLottery, { foreignKey: 'message_id', as: 'lotteryResults' });
InInstantwinMessageLottery.belongsTo(InInstantwinMessage, { foreignKey: 'message_id', as: 'message' });
const db = {
    sequelize,
    Sequelize: sequelize_1.Sequelize,
    Campaign,
    InInstantwinPrize,
    InInstantwinTemplate,
    InInstantwinNode,
    InInstantwinEdge,
    InInstantwinMessage,
    InInstantwinMessageSelectOption,
    InInstantwinMessageCard,
    InInstantwinMessageCardButton,
    InInstantwinConversation,
    InInstantwinMessageLottery,
};
exports.default = db;
