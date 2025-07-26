// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  VALIDATION_ERROR: 'バリデーションエラーが発生しました',
  UNAUTHORIZED: '認証が必要です',
  FORBIDDEN: 'アクセスが拒否されました',
  NOT_FOUND: 'リソースが見つかりません',
  INTERNAL_ERROR: '内部サーバーエラーが発生しました',
  DATABASE_ERROR: 'データベースエラーが発生しました',
  CAMPAIGN_NOT_FOUND: 'キャンペーンが見つかりません',
  PRIZE_NOT_FOUND: 'プライズが見つかりません',
  TEMPLATE_NOT_FOUND: 'テンプレートが見つかりません',
  CONVERSATION_NOT_FOUND: '会話が見つかりません',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  CREATED: 'リソースが正常に作成されました',
  UPDATED: 'リソースが正常に更新されました',
  DELETED: 'リソースが正常に削除されました',
  CAMPAIGN_CREATED: 'キャンペーンが正常に作成されました',
  CAMPAIGN_UPDATED: 'キャンペーンが正常に更新されました',
  CAMPAIGN_DELETED: 'キャンペーンが正常に削除されました',
  PRIZE_CREATED: 'プライズが正常に作成されました',
  PRIZE_UPDATED: 'プライズが正常に更新されました',
  PRIZE_DELETED: 'プライズが正常に削除されました',
} as const;

// Default Values
export const DEFAULT_VALUES = {
  PAGE: 1,
  LIMIT: 20,
  MAX_LIMIT: 100,
} as const;

// Campaign Status
export const CAMPAIGN_STATUS = {
  DRAFT: 'draft',
  ACTIVE: 'active',
  PAUSED: 'paused',
  COMPLETED: 'completed',
  ARCHIVED: 'archived',
} as const;

// Template Types
export const TEMPLATE_TYPES = {
  START: 0,
  MESSAGE: 1,
  TREE: 2,
  LOTTERY_GROUP: 3,
  END: 4,
} as const;

// Node Types
export const NODE_TYPES = {
  FIRST_TRIGGER: 0,
  MESSAGE: 1,
  MESSAGE_SELECT_OPTION: 2,
  LOTTERY: 3,
  LOTTERY_MESSAGE: 4,
} as const;

// Message Types
export const MESSAGE_TYPES = {
  TEXT: 0,
  MEDIA: 1,
  CARD: 2,
  SELECT: 3,
} as const;
