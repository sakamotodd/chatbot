// Prize API constants
export const PRIZE_CONSTANTS = {
  // Default values
  DEFAULT_WINNING_RATE: 10.0,
  DEFAULT_WINNING_RATE_CHANGE_TYPE: 1,
  DEFAULT_SEND_WINNER_COUNT: 0,
  DEFAULT_IS_DAILY_LOTTERY: false,

  // Validation limits
  MAX_NAME_LENGTH: 255,
  MAX_DESCRIPTION_LENGTH: 1000,
  MIN_WINNER_COUNT: 1,
  MIN_WINNING_RATE: 0.0,
  MAX_WINNING_RATE: 100.0,
  MIN_DAILY_WINNER_COUNT: 1,
  MIN_LOTTERY_COUNT_PER_MINUTE: 1,

  // Pagination limits
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
  MIN_PAGE_SIZE: 1,

  // Template types (matching database enum)
  TEMPLATE_TYPES: {
    START: 0,
    MESSAGE: 1,
    TREE: 2,
    LOTTERY_GROUP: 3,
    END: 4,
  },

  // Default templates to create
  DEFAULT_TEMPLATES: [
    { name: '最初のトリガー', type: 0, step_order: 1 },
    { name: 'フォローチェック', type: 2, step_order: 2 },
    { name: 'アンケート', type: 1, step_order: 3 },
    { name: '抽選', type: 3, step_order: 4 },
    { name: '終了トリガー', type: 4, step_order: 5 },
  ],

  // Error codes
  ERROR_CODES: {
    VALIDATION_ERROR: 'VALIDATION_ERROR',
    PRIZE_NOT_FOUND: 'PRIZE_NOT_FOUND',
    CAMPAIGN_NOT_FOUND: 'CAMPAIGN_NOT_FOUND',
    PRIZE_UPDATE_CONFLICT: 'PRIZE_UPDATE_CONFLICT',
    PRIZE_DELETE_CONFLICT: 'PRIZE_DELETE_CONFLICT',
    UNAUTHORIZED: 'UNAUTHORIZED',
    FORBIDDEN: 'FORBIDDEN',
    RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
    INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
  },

  // Success messages
  MESSAGES: {
    PRIZE_CREATED: 'プライズが正常に作成されました',
    PRIZE_UPDATED: 'プライズが正常に更新されました',
    PRIZE_DELETED: 'プライズが正常に削除されました',
    PRIZES_RETRIEVED: 'プライズ一覧を取得しました',
    PRIZE_RETRIEVED: 'プライズ詳細を取得しました',
    PRIZE_STATISTICS_RETRIEVED: 'プライズ統計情報を取得しました',
  },
};