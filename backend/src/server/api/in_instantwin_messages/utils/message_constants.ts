// Message API constants
export const MESSAGE_CONSTANTS = {
  // Validation limits
  MAX_CONTENT_LENGTH: 5000,
  MAX_STEP_ORDER: 999,

  // Pagination defaults
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
  MIN_PAGE_SIZE: 1,

  // Message types (matching MessageType enum)
  MESSAGE_TYPES: {
    TEXT: 0,
    IMAGE: 1,
    CARD: 2,
    QUICK_REPLY: 3,
    POSTBACK: 4,
  },

  // Error codes
  ERROR_CODES: {
    VALIDATION_ERROR: 'VALIDATION_ERROR',
    MESSAGE_NOT_FOUND: 'MESSAGE_NOT_FOUND',
    NODE_NOT_FOUND: 'NODE_NOT_FOUND',
    DUPLICATE_STEP_ORDER: 'DUPLICATE_STEP_ORDER',
    UNAUTHORIZED: 'UNAUTHORIZED',
    FORBIDDEN: 'FORBIDDEN',
    RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
    INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
  },

  // Success messages
  MESSAGES: {
    MESSAGE_CREATED: 'メッセージが正常に作成されました',
    MESSAGE_UPDATED: 'メッセージが正常に更新されました',
    MESSAGE_DELETED: 'メッセージが正常に削除されました',
    MESSAGES_RETRIEVED: 'メッセージ一覧を取得しました',
    MESSAGE_RETRIEVED: 'メッセージ詳細を取得しました',
  },
};