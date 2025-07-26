# プライズ管理API ドキュメント

## 概要
Instagramインスタントウィンキャンペーンのプライズ管理に関するAPIエンドポイントの詳細仕様。
キャンペーンに紐づく賞品の管理、当選確率の設定、日次制限の管理を行います。

## ベースURL
```
/api/campaigns/:campaignId/in_instantwin_prizes
/api/in_instantwin_prizes
```

---

## エンドポイント一覧

### 1. プライズ一覧取得

#### エンドポイント
```
GET /api/campaigns/:campaignId/in_instantwin_prizes
```

#### 説明
指定されたキャンペーンに紐づく全プライズの一覧を取得します。テンプレート情報も含めて取得します。

**メインSQL:**
```sql
SELECT p.id, p.campaign_id, p.name, p.description, p.send_winner_count, 
       p.winner_count, p.winning_rate_change_type, p.winning_rate, 
       p.daily_winner_count, p.is_daily_lottery, p.lottery_count_per_minute,
       p.lottery_count_per_minute_updated_datetime, p.created, p.modified
FROM in_instantwin_prizes p
WHERE p.campaign_id = ?
ORDER BY p.created DESC
LIMIT ? OFFSET ?;

-- テンプレート情報も取得
SELECT t.id, t.prize_id, t.name, t.type, t.step_order, t.created, t.modified
FROM in_instantwin_templates t
WHERE t.prize_id IN (SELECT id FROM in_instantwin_prizes WHERE campaign_id = ?);
```

#### リクエストパラメータ

##### パスパラメータ
| パラメータ | 型 | 必須 | 説明 | 例 |
|-----------|---|------|------|---|
| `campaignId` | number | ✓ | キャンペーンID | `/api/campaigns/123/in_instantwin_prizes` |

##### クエリパラメータ（オプション）
| パラメータ | 型 | 説明 | デフォルト | 例 |
|-----------|---|------|----------|---|
| `page` | number | ページ番号（1から開始） | 1 | `?page=2` |
| `limit` | number | 1ページあたりの取得件数 | 10 | `?limit=20` |
| `include_templates` | boolean | テンプレート情報を含めるか | true | `?include_templates=false` |

#### レスポンス

##### 成功時 (200 OK)
```json
{
  "success": true,
  "data": {
    "in_instantwin_prizes": [
      {
        "id": 1,
        "campaign_id": 123,
        "name": "豪華賞品A",
        "description": "抽選で10名様に当たる豪華賞品です。",
        "send_winner_count": 0,
        "winner_count": 10,
        "winning_rate_change_type": 1,
        "winning_rate": 5.5,
        "daily_winner_count": 2,
        "is_daily_lottery": true,
        "lottery_count_per_minute": 100,
        "lottery_count_per_minute_updated_datetime": "2024-03-15T10:00:00.000Z",
        "created": "2024-03-01T10:00:00.000Z",
        "modified": "2024-03-15T15:30:00.000Z",
        "in_instantwin_templates": [
          {
            "id": 1,
            "prize_id": 1,
            "name": "最初のトリガー",
            "type": "start",
            "step_order": 1,
            "created": "2024-03-01T10:00:00.000Z",
            "modified": "2024-03-01T10:00:00.000Z"
          },
          {
            "id": 2,
            "prize_id": 1,
            "name": "フォローチェック",
            "type": "tree",
            "step_order": 2,
            "created": "2024-03-01T10:00:00.000Z",
            "modified": "2024-03-01T10:00:00.000Z"
          }
        ]
      }
    ],
    "pagination": {
      "current_page": 1,
      "total_pages": 3,
      "total_count": 25,
      "per_page": 10,
      "has_next": true,
      "has_prev": false
    }
  }
}
```

##### エラー時 (404 Not Found)
```json
{
  "success": false,
  "error": {
    "code": "CAMPAIGN_NOT_FOUND",
    "message": "指定されたキャンペーンが見つかりません",
    "details": {
      "campaign_id": 999
    }
  }
}
```

#### ステータスコード
- `200`: 成功
- `400`: 無効なパラメータ
- `404`: キャンペーンが見つからない
- `500`: サーバーエラー

---

### 2. プライズ詳細取得

#### エンドポイント
```
GET /api/in_instantwin_prizes/:id
```

#### 説明
指定されたIDのプライズ詳細情報を取得します。関連するテンプレート、ノード、メッセージ情報も含めて取得できます。

**メインSQL:**
```sql
SELECT p.id, p.campaign_id, p.name, p.description, p.send_winner_count, 
       p.winner_count, p.winning_rate_change_type, p.winning_rate, 
       p.daily_winner_count, p.is_daily_lottery, p.lottery_count_per_minute,
       p.lottery_count_per_minute_updated_datetime, p.created, p.modified
FROM in_instantwin_prizes p
WHERE p.id = ?;

-- 関連テンプレート取得（詳細モード）
SELECT t.id, t.prize_id, t.name, t.type, t.step_order, t.created, t.modified
FROM in_instantwin_templates t
WHERE t.prize_id = ?
ORDER BY t.step_order;

-- 関連ノード取得（詳細モード）
SELECT n.id, n.template_id, n.prize_id, n.type, n.created, n.modified
FROM in_instantwin_nodes n
WHERE n.prize_id = ?;
```

#### リクエストパラメータ

##### パスパラメータ
| パラメータ | 型 | 必須 | 説明 | 例 |
|-----------|---|------|------|---|
| `id` | number | ✓ | プライズID | `/api/in_instantwin_prizes/123` |

##### クエリパラメータ（オプション）
| パラメータ | 型 | 説明 | デフォルト | 例 |
|-----------|---|------|----------|---|
| `include_templates` | boolean | テンプレート情報を含めるか | true | `?include_templates=false` |
| `include_nodes` | boolean | ノード情報を含めるか | false | `?include_nodes=true` |
| `include_messages` | boolean | メッセージ情報を含めるか | false | `?include_messages=true` |

#### レスポンス

##### 成功時 (200 OK)
```json
{
  "success": true,
  "data": {
    "in_instantwin_prize": {
      "id": 1,
      "campaign_id": 123,
      "name": "豪華賞品A",
      "description": "抽選で10名様に当たる豪華賞品です。詳細説明...",
      "send_winner_count": 3,
      "winner_count": 10,
      "winning_rate_change_type": 1,
      "winning_rate": 5.5,
      "daily_winner_count": 2,
      "is_daily_lottery": true,
      "lottery_count_per_minute": 100,
      "lottery_count_per_minute_updated_datetime": "2024-03-15T10:00:00.000Z",
      "created": "2024-03-01T10:00:00.000Z",
      "modified": "2024-03-15T15:30:00.000Z",
      "in_instantwin_templates": [
        {
          "id": 1,
          "prize_id": 1,
          "name": "最初のトリガー",
          "type": "start",
          "step_order": 1,
          "created": "2024-03-01T10:00:00.000Z",
          "modified": "2024-03-01T10:00:00.000Z"
        }
      ]
    }
  }
}
```

##### エラー時 (404 Not Found)
```json
{
  "success": false,
  "error": {
    "code": "PRIZE_NOT_FOUND",
    "message": "指定されたプライズが見つかりません",
    "details": {
      "prize_id": 999
    }
  }
}
```

#### ステータスコード
- `200`: 成功
- `400`: 無効なID
- `404`: プライズが見つからない
- `500`: サーバーエラー

---

### 3. プライズ作成

#### エンドポイント
```
POST /api/campaigns/:campaignId/in_instantwin_prizes
```

#### 説明
指定されたキャンペーンに新しいプライズを作成します。デフォルトテンプレートセット（start, tree, message, lottery_group, end）も同時に作成されます。

**メインSQL:**
```sql
-- 1. プライズ作成
INSERT INTO in_instantwin_prizes (
  campaign_id, name, description, send_winner_count, winner_count, 
  winning_rate_change_type, winning_rate, daily_winner_count, 
  is_daily_lottery, lottery_count_per_minute, 
  lottery_count_per_minute_updated_datetime, created, modified
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW());
SET @prize_id = LAST_INSERT_ID();

-- 2. デフォルトテンプレート作成（5つ）
INSERT INTO in_instantwin_templates (prize_id, name, type, step_order, created, modified) VALUES
(@prize_id, '最初のトリガー', 'start', 1, NOW(), NOW()),
(@prize_id, 'フォローチェック', 'tree', 2, NOW(), NOW()),
(@prize_id, 'アンケート', 'message', 3, NOW(), NOW()),
(@prize_id, '抽選', 'lottery_group', 4, NOW(), NOW()),
(@prize_id, '終了トリガー', 'end', 5, NOW(), NOW());

-- 3. 基本ノード作成
INSERT INTO in_instantwin_nodes (template_id, prize_id, type, created, modified)
SELECT t.id, @prize_id, 'first_trigger', NOW(), NOW() 
FROM in_instantwin_templates t 
WHERE t.prize_id = @prize_id AND t.type = 'start';
```

#### リクエストパラメータ

##### パスパラメータ
| パラメータ | 型 | 必須 | 説明 | 例 |
|-----------|---|------|------|---|
| `campaignId` | number | ✓ | キャンペーンID | `/api/campaigns/123/in_instantwin_prizes` |

#### リクエストボディ
```json
{
  "name": "夏のプレゼント",
  "description": "夏にぴったりの素敵なプレゼントです！",
  "winner_count": 50,
  "winning_rate": 10.0,
  "daily_winner_count": 5,
  "is_daily_lottery": true,
  "lottery_count_per_minute": 200
}
```

#### リクエストパラメータ

| フィールド | 型 | 必須 | 説明 | 制約 |
|-----------|---|------|------|------|
| `name` | string | ✓ | プライズ名 | 1-255文字 |
| `description` | string | - | プライズ説明 | 最大1000文字 |
| `winner_count` | number | ✓ | 当選者数 | 1以上の整数 |
| `winning_rate` | number | - | 当選確率（%） | 0.0-100.0（デフォルト: 10.0） |
| `daily_winner_count` | number | - | 日次当選者数制限 | 1以上の整数 |
| `is_daily_lottery` | boolean | - | 日次抽選有効フラグ | デフォルト: false |
| `lottery_count_per_minute` | number | - | 分間抽選回数制限 | 1以上の整数 |

#### レスポンス

##### 成功時 (201 Created)
```json
{
  "success": true,
  "data": true,
  "message": "プライズが正常に作成されました"
}
```

##### エラー時 (400 Bad Request)
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "入力値に不正があります",
    "details": [
      {
        "field": "name",
        "message": "プライズ名は必須です"
      },
      {
        "field": "winner_count",
        "message": "当選者数は1以上である必要があります"
      }
    ]
  }
}
```

#### ステータスコード
- `201`: 作成成功
- `400`: バリデーションエラー
- `404`: キャンペーンが見つからない
- `500`: サーバーエラー

---

### 4. プライズ更新

#### エンドポイント
```
PUT /api/in_instantwin_prizes/:id
```

#### 説明
既存のプライズ情報を更新します。当選確率や制限値の変更が可能です。

**メインSQL:**
```sql
-- 現在の状態確認
SELECT send_winner_count, winner_count, winning_rate 
FROM in_instantwin_prizes 
WHERE id = ?;

-- プライズ更新
UPDATE in_instantwin_prizes 
SET name = ?, description = ?, winner_count = ?, winning_rate = ?, 
    daily_winner_count = ?, is_daily_lottery = ?, 
    lottery_count_per_minute = ?, modified = NOW()
WHERE id = ?;

-- 当選確率変更の場合、関連する抽選履歴の再計算
UPDATE in_instantwin_lottery_results 
SET recalculated_at = NOW() 
WHERE prize_id = ? AND created > DATE_SUB(NOW(), INTERVAL 1 DAY);
```

#### リクエストパラメータ

##### パスパラメータ
| パラメータ | 型 | 必須 | 説明 | 例 |
|-----------|---|------|------|---|
| `id` | number | ✓ | プライズID | `/api/in_instantwin_prizes/123` |

#### リクエストボディ
```json
{
  "name": "夏のプレゼント（更新版）",
  "description": "期間延長！さらに豪華になりました。",
  "winner_count": 100,
  "winning_rate": 15.0,
  "daily_winner_count": 10,
  "is_daily_lottery": true,
  "lottery_count_per_minute": 300
}
```

#### リクエストパラメータ

| フィールド | 型 | 必須 | 説明 | 制約 |
|-----------|---|------|------|------|
| `name` | string | - | プライズ名 | 1-255文字 |
| `description` | string | - | プライズ説明 | 最大1000文字 |
| `winner_count` | number | - | 当選者数 | 現在の当選者数以上 |
| `winning_rate` | number | - | 当選確率（%） | 0.0-100.0 |
| `daily_winner_count` | number | - | 日次当選者数制限 | 1以上の整数 |
| `is_daily_lottery` | boolean | - | 日次抽選有効フラグ | - |
| `lottery_count_per_minute` | number | - | 分間抽選回数制限 | 1以上の整数 |

#### レスポンス

##### 成功時 (200 OK)
```json
{
  "success": true,
  "data": true,
  "message": "プライズが正常に更新されました"
}
```

##### エラー時 (409 Conflict)
```json
{
  "success": false,
  "error": {
    "code": "PRIZE_UPDATE_CONFLICT",
    "message": "当選者数は現在の当選者数より小さくできません",
    "details": {
      "current_winner_count": 50,
      "send_winner_count": 25,
      "attempted_winner_count": 20
    }
  }
}
```

#### ステータスコード
- `200`: 更新成功
- `400`: バリデーションエラー
- `404`: プライズが見つからない
- `409`: 更新競合エラー
- `500`: サーバーエラー

---

### 5. プライズ削除

#### エンドポイント
```
DELETE /api/in_instantwin_prizes/:id
```

#### 説明
指定されたプライズを削除します。関連するテンプレート、ノード、メッセージも全て削除されます。進行中の会話がある場合は削除できません。

**メインSQL:**
```sql
-- 1. 進行中の会話確認
SELECT COUNT(*) as active_conversations
FROM in_instantwin_conversations 
WHERE prize_id = ? AND session_data IS NOT NULL;

-- 2. 関連データ削除（force=trueの場合）
DELETE FROM in_instantwin_lottery_results WHERE prize_id = ?;
DELETE FROM in_instantwin_message_lottery WHERE prize_id = ?;
DELETE FROM in_instantwin_message_card_buttons 
WHERE card_id IN (
  SELECT c.id FROM in_instantwin_message_cards c 
  JOIN in_instantwin_messages m ON c.message_id = m.id 
  WHERE m.prize_id = ?
);
DELETE FROM in_instantwin_message_cards 
WHERE message_id IN (SELECT id FROM in_instantwin_messages WHERE prize_id = ?);
DELETE FROM in_instantwin_message_select_options WHERE prize_id = ?;
DELETE FROM in_instantwin_messages WHERE prize_id = ?;
DELETE FROM in_instantwin_edges 
WHERE from_node_id IN (SELECT id FROM in_instantwin_nodes WHERE prize_id = ?)
   OR to_node_id IN (SELECT id FROM in_instantwin_nodes WHERE prize_id = ?);
DELETE FROM in_instantwin_nodes WHERE prize_id = ?;
DELETE FROM in_instantwin_templates WHERE prize_id = ?;

-- 3. プライズ削除
DELETE FROM in_instantwin_prizes WHERE id = ?;
```

#### リクエストパラメータ

##### パスパラメータ
| パラメータ | 型 | 必須 | 説明 | 例 |
|-----------|---|------|------|---|
| `id` | number | ✓ | プライズID | `/api/in_instantwin_prizes/123` |

##### クエリパラメータ（オプション）
| パラメータ | 型 | 説明 | デフォルト | 例 |
|-----------|---|------|----------|---|
| `force` | boolean | 強制削除フラグ（進行中の会話があっても削除） | false | `?force=true` |

#### レスポンス

##### 成功時 (200 OK)
```json
{
  "success": true,
  "data": {
    "deleted_prize_id": 123,
    "deleted_related_data": {
      "templates": 5,
      "nodes": 23,
      "messages": 15,
      "conversations": 0
    }
  },
  "message": "プライズが正常に削除されました"
}
```

##### エラー時 (409 Conflict)
```json
{
  "success": false,
  "error": {
    "code": "PRIZE_DELETE_CONFLICT",
    "message": "進行中の会話があるため削除できません",
    "details": {
      "prize_id": 123,
      "active_conversations": 5,
      "suggestion": "進行中の会話を終了してから削除するか、force=trueパラメータを使用してください"
    }
  }
}
```

#### ステータスコード
- `200`: 削除成功
- `404`: プライズが見つからない
- `409`: 削除競合エラー（進行中の会話）
- `500`: サーバーエラー

---

## 共通仕様

### 認証
全てのエンドポイントで認証が必要です。
```
Authorization: Bearer {access_token}
```

### レート制限
- 1分間に60リクエストまで
- 制限に達した場合は429 Too Many Requestsを返します

### エラーレスポンス形式
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "エラーメッセージ",
    "details": {
      // 追加の詳細情報
    }
  },
  "timestamp": "2024-03-15T10:30:00.000Z",
  "path": "/api/in_instantwin_prizes/123"
}
```

### 共通エラーコード

| コード | 説明 | HTTPステータス |
|--------|------|---------------|
| `VALIDATION_ERROR` | 入力値バリデーションエラー | 400 |
| `PRIZE_NOT_FOUND` | プライズが見つからない | 404 |
| `CAMPAIGN_NOT_FOUND` | キャンペーンが見つからない | 404 |
| `PRIZE_UPDATE_CONFLICT` | プライズ更新競合エラー | 409 |
| `PRIZE_DELETE_CONFLICT` | プライズ削除競合エラー | 409 |
| `UNAUTHORIZED` | 認証エラー | 401 |
| `FORBIDDEN` | アクセス権限なし | 403 |
| `RATE_LIMIT_EXCEEDED` | レート制限超過 | 429 |
| `INTERNAL_SERVER_ERROR` | サーバー内部エラー | 500 |

### 日時形式
全ての日時はISO 8601形式（UTC）で表現されます。
```
2024-03-15T10:30:00.000Z
```

### ページネーション
一覧取得APIでは以下のページネーション情報が含まれます。
```json
{
  "pagination": {
    "current_page": 1,
    "total_pages": 5,
    "total_count": 47,
    "per_page": 10,
    "has_next": true,
    "has_prev": false
  }
}
```

### プライズタイプ定義

#### 当選確率変更タイプ (winning_rate_change_type)
- `1`: 固定確率
- `2`: 段階的減少
- `3`: 時間帯別変更
- `4`: 動的調整

#### 抽選制限
- `daily_winner_count`: 1日あたりの最大当選者数
- `lottery_count_per_minute`: 1分間あたりの最大抽選回数
- `is_daily_lottery`: 日次抽選制限の有効/無効