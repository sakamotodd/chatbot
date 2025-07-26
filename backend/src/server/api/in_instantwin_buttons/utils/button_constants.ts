// Button API constants
export const BUTTON_CONSTANTS = {
  // Validation limits
  MAX_TEXT_LENGTH: 100,
  MAX_VALUE_LENGTH: 200,
  MAX_URL_LENGTH: 500,
  MAX_STEP_ORDER: 999,

  // Pagination defaults
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
  MIN_PAGE_SIZE: 1,

  // Button types (matching ButtonType enum)
  BUTTON_TYPES: {
    POSTBACK: 0,
    URL: 1,
    PHONE: 2,
    QUICK_REPLY: 3,
  },

  // Error codes
  ERROR_CODES: {
    VALIDATION_ERROR: 'VALIDATION_ERROR',
    BUTTON_NOT_FOUND: 'BUTTON_NOT_FOUND',
    CARD_NOT_FOUND: 'CARD_NOT_FOUND',
    DUPLICATE_STEP_ORDER: 'DUPLICATE_STEP_ORDER',
    UNAUTHORIZED: 'UNAUTHORIZED',
    FORBIDDEN: 'FORBIDDEN',
    RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
    INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
  },

  // Success messages
  MESSAGES: {
    BUTTON_CREATED: 'ボタンが正常に作成されました',
    BUTTON_UPDATED: 'ボタンが正常に更新されました',
    BUTTON_DELETED: 'ボタンが正常に削除されました',
    BUTTONS_RETRIEVED: 'ボタン一覧を取得しました',
    BUTTON_RETRIEVED: 'ボタン詳細を取得しました',
  },
};