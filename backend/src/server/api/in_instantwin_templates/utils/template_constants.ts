// Template API constants
export const TEMPLATE_CONSTANTS = {
  // Template types (matching database enum)
  TEMPLATE_TYPES: {
    START: 0,
    MESSAGE: 1,
    TREE: 2,
    LOTTERY_GROUP: 3,
    END: 4,
  },

  // Template type names
  TEMPLATE_TYPE_NAMES: {
    0: 'start',
    1: 'message', 
    2: 'tree',
    3: 'lottery_group',
    4: 'end',
  },

  // Reverse mapping for validation
  TEMPLATE_TYPE_MAP: {
    'start': 0,
    'message': 1,
    'tree': 2,
    'lottery_group': 3,
    'end': 4,
  },

  // Validation limits
  MAX_NAME_LENGTH: 255,
  MIN_STEP_ORDER: 1,

  // Required templates (cannot be deleted)
  REQUIRED_TEMPLATES: ['start', 'end'],

  // Node type mappings
  NODE_TYPE_MAP: {
    'first_trigger': 0,     // NodeType.FIRST_TRIGGER
    'message': 1,           // NodeType.MESSAGE
    'message_select_option': 2,  // NodeType.MESSAGE_SELECT_OPTION
    'lottery': 3,           // NodeType.LOTTERY
    'lottery_message': 4,   // NodeType.LOTTERY_MESSAGE
  },

  // Default node configurations by template type
  DEFAULT_NODE_CONFIGS: {
    start: [
      { type: 0 }  // FIRST_TRIGGER
    ],
    tree: [
      { type: 1 },  // MESSAGE
      { type: 2 },  // MESSAGE_SELECT_OPTION
      { type: 2 }   // MESSAGE_SELECT_OPTION
    ],
    message: [
      { type: 1 },  // MESSAGE
      { type: 2 },  // MESSAGE_SELECT_OPTION
      { type: 2 },  // MESSAGE_SELECT_OPTION
      { type: 2 }   // MESSAGE_SELECT_OPTION
    ],
    lottery_group: [
      { type: 3 },  // LOTTERY
      { type: 4 },  // LOTTERY_MESSAGE
      { type: 4 }   // LOTTERY_MESSAGE
    ],
    end: [
      { type: 1 }   // MESSAGE
    ]
  },

  // Error codes
  ERROR_CODES: {
    VALIDATION_ERROR: 'VALIDATION_ERROR',
    TEMPLATE_NOT_FOUND: 'TEMPLATE_NOT_FOUND',
    PRIZE_NOT_FOUND: 'PRIZE_NOT_FOUND',
    TEMPLATE_UPDATE_CONFLICT: 'TEMPLATE_UPDATE_CONFLICT',
    TEMPLATE_DELETE_CONFLICT: 'TEMPLATE_DELETE_CONFLICT',
    UNAUTHORIZED: 'UNAUTHORIZED',
    FORBIDDEN: 'FORBIDDEN',
    RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
    INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
  },

  // Success messages
  MESSAGES: {
    TEMPLATE_CREATED: 'テンプレートが正常に作成されました',
    TEMPLATE_UPDATED: 'テンプレートが正常に更新されました',
    TEMPLATE_DELETED: 'テンプレートが正常に削除されました',
    TEMPLATE_RETRIEVED: 'テンプレート詳細を取得しました',
    TEMPLATES_RETRIEVED: 'テンプレート一覧を取得しました',
  },
};