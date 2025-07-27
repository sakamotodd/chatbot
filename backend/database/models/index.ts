import { Sequelize, DataTypes } from 'sequelize';
import { createCampaignModel } from './campaigns';
import { createInInstantwinPrizeModel } from './in_instantwin_prizes';
import { createInInstantwinTemplateModel } from './in_instantwin_templates';
import { createInInstantwinNodeModel } from './in_instantwin_nodes';
import { createInInstantwinEdgeModel } from './in_instantwin_edges';
import { createInInstantwinMessageModel } from './in_instantwin_messages';
import { createInInstantwinMessageSelectOptionModel } from './in_instantwin_message_select_options';
import { createInInstantwinMessageCardModel } from './in_instantwin_message_cards';
import { createInInstantwinMessageCardButtonModel } from './in_instantwin_message_card_buttons';
import { createInInstantwinConversationModel } from './in_instantwin_conversations';
import { createInInstantwinMessageLotteryModel } from './in_instantwin_message_lottery';

const env = process.env.NODE_ENV || 'development';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const config = require('../config.js')[env];

let sequelize: Sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable]!, config);
} else if (config.dialect === 'sqlite') {
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: config.storage,
    logging: config.logging || false,
    pool: config.pool
  });
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

// Initialize models
const Campaign = createCampaignModel(sequelize, DataTypes);
const InInstantwinPrize = createInInstantwinPrizeModel(sequelize, DataTypes);
const InInstantwinTemplate = createInInstantwinTemplateModel(sequelize, DataTypes);
const InInstantwinNode = createInInstantwinNodeModel(sequelize, DataTypes);
const InInstantwinEdge = createInInstantwinEdgeModel(sequelize, DataTypes);
const InInstantwinMessage = createInInstantwinMessageModel(sequelize, DataTypes);
const InInstantwinMessageSelectOption = createInInstantwinMessageSelectOptionModel(sequelize, DataTypes);
const InInstantwinMessageCard = createInInstantwinMessageCardModel(sequelize, DataTypes);
const InInstantwinMessageCardButton = createInInstantwinMessageCardButtonModel(sequelize, DataTypes);
const InInstantwinConversation = createInInstantwinConversationModel(sequelize, DataTypes);
const InInstantwinMessageLottery = createInInstantwinMessageLotteryModel(sequelize, DataTypes);

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
  Sequelize,
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

export default db;
export {
  sequelize,
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