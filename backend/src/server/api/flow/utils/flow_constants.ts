// Flow validation constants
export const FLOW_CONSTANTS = {
  // Error codes
  ERROR_CODES: {
    VALIDATION_ERROR: 'VALIDATION_ERROR',
    TEMPLATE_NOT_FOUND: 'TEMPLATE_NOT_FOUND',
    NO_NODES_FOUND: 'NO_NODES_FOUND',
    INVALID_FLOW: 'INVALID_FLOW',
    UNAUTHORIZED: 'UNAUTHORIZED',
    FORBIDDEN: 'FORBIDDEN',
    RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
    INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
  },

  // Success messages
  MESSAGES: {
    FLOW_VALIDATION_COMPLETED: 'フロー検証が完了しました',
    FLOW_VALID: 'フローは有効です',
    FLOW_INVALID: 'フローに問題があります',
  },

  // Node types
  NODE_TYPES: {
    START: 0,
    MESSAGE: 1,
    TREE: 2,
    LOTTERY_GROUP: 3,
    END: 4,
  },

  // Validation limits
  MAX_PATH_DEPTH: 100,
  MAX_TOTAL_PATHS: 1000,
};