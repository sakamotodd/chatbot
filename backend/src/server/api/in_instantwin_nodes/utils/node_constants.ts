// Node API constants
export const NODE_CONSTANTS = {
  // Node types (matching database enum)
  NODE_TYPES: {
    FIRST_TRIGGER: 0,
    MESSAGE: 1,
    MESSAGE_SELECT_OPTION: 2,
    LOTTERY: 3,
    LOTTERY_MESSAGE: 4,
  },

  // Node type names
  NODE_TYPE_NAMES: {
    0: 'first_trigger',
    1: 'message',
    2: 'message_select_option',
    3: 'lottery',
    4: 'lottery_message',
  },

  // Reverse mapping for validation
  NODE_TYPE_MAP: {
    'first_trigger': 0,
    'message': 1,
    'message_select_option': 2,
    'lottery': 3,
    'lottery_message': 4,
  },

  // Pagination defaults
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
  MIN_PAGE_SIZE: 1,

  // Error codes
  ERROR_CODES: {
    VALIDATION_ERROR: 'VALIDATION_ERROR',
    NODE_NOT_FOUND: 'NODE_NOT_FOUND',
    TEMPLATE_NOT_FOUND: 'TEMPLATE_NOT_FOUND',
    PRIZE_NOT_FOUND: 'PRIZE_NOT_FOUND',
    UNAUTHORIZED: 'UNAUTHORIZED',
    FORBIDDEN: 'FORBIDDEN',
    RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
    INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
  },

  // Success messages
  MESSAGES: {
    NODE_CREATED: 'ノードが正常に作成されました',
    NODE_UPDATED: 'ノードが正常に更新されました',
    NODE_DELETED: 'ノードが正常に削除されました',
    NODES_RETRIEVED: 'ノード一覧を取得しました',
    NODE_RETRIEVED: 'ノード詳細を取得しました',
  },
};