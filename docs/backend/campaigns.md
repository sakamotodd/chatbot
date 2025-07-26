# キャンペーン管理API ドキュメント

## 概要
Instagramインスタントウィンキャンペーンのキャンペーン管理に関するAPIエンドポイントの詳細仕様。

## ベースURL
```
/api/campaigns
```

---

## エンドポイント一覧

### 1. キャンペーン一覧取得

#### エンドポイント
```
GET /api/campaigns
```

#### 説明
システムに登録されている全キャンペーンの一覧を取得します。

**メインSQL:**
```sql
SELECT id, title, description, status, start_date, end_date, created, modified 
FROM campaigns 
WHERE status = ? -- statusパラメータがある場合
ORDER BY created DESC -- sortパラメータに応じて変更
LIMIT ? OFFSET ?; -- ページネーション
```

#### リクエストパラメータ

##### クエリパラメータ（オプション）
| パラメータ | 型 | 説明 | デフォルト | 例 |
|-----------|---|------|----------|---|
| `page` | number | ページ番号（1から開始） | 1 | `?page=2` |
| `limit` | number | 1ページあたりの取得件数 | 10 | `?limit=20` |
| `status` | string | キャンペーンステータスでフィルタ | - | `?status=active` |
| `sort` | string | ソート順（created_asc, created_desc, title_asc, title_desc） | created_desc | `?sort=title_asc` |

#### レスポンス

##### 成功時 (200 OK)
```json
{
  "success": true,
  "data": {
    "campaigns": [
      {
        "id": 1,
        "title": "春のプレゼントキャンペーン",
        "description": "フォロー&いいねで豪華プレゼントが当たる！",
        "status": "active",
        "start_date": "2024-03-01T00:00:00.000Z",
        "end_date": "2024-03-31T23:59:59.000Z",
        "created": "2024-02-15T10:00:00.000Z",
        "modified": "2024-02-20T15:30:00.000Z"
      }
    ],
    "pagination": {
      "current_page": 1,
      "total_pages": 5,
      "total_count": 47,
      "per_page": 10,
      "has_next": true,
      "has_prev": false
    }
  }
}
```

##### エラー時 (400 Bad Request)
```json
{
  "success": false,
  "error": {
    "code": "INVALID_PARAMETER",
    "message": "無効なクエリパラメータです",
    "details": {
      "field": "status",
      "value": "invalid_status",
      "allowed_values": ["draft", "active", "paused", "completed"]
    }
  }
}
```

#### ステータスコード
- `200`: 成功
- `400`: リクエストパラメータエラー
- `500`: サーバーエラー

---

### 2. キャンペーン詳細取得

#### エンドポイント
```
GET /api/campaigns/:id
```

#### 説明
指定されたIDのキャンペーン詳細情報を取得します。

**メインSQL:**
```sql
SELECT id, title, description, status, start_date, end_date, created, modified 
FROM campaigns 
WHERE id = ?;
```

#### リクエストパラメータ

##### パスパラメータ
| パラメータ | 型 | 必須 | 説明 | 例 |
|-----------|---|------|------|---|
| `id` | number | ✓ | キャンペーンID | `/api/campaigns/123` |

#### レスポンス

##### 成功時 (200 OK)
```json
{
  "success": true,
  "data": {
    "campaign": {
      "id": 1,
      "title": "春のプレゼントキャンペーン",
      "description": "フォロー&いいねで豪華プレゼントが当たる！春の新商品をプレゼント。参加方法は簡単、アカウントをフォローして投稿にいいねするだけ！",
      "status": "active",
      "start_date": "2024-03-01T00:00:00.000Z",
      "end_date": "2024-03-31T23:59:59.000Z",
      "created": "2024-02-15T10:00:00.000Z",
      "modified": "2024-02-20T15:30:00.000Z"
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
- `400`: 無効なID
- `404`: キャンペーンが見つからない
- `500`: サーバーエラー

---

### 3. キャンペーン作成

#### エンドポイント
```
POST /api/campaigns
```

#### 説明
新しいキャンペーンを作成します。
キャンペーンに付随する情報も作成します。

作成概要
- キャンペーン情報
  - campaignsテーブル

- キャンペーンプライズ情報
  - in_instantwin_prizes
    - 対象: 1つ

- キャンペーンプライズ情報>キャンペーンテンプレート情報
  - in_instantwin_templates
    - 最初のトリガー
      - type: start
      - name: '最初のトリガー'
    - フォローチェック
      - type: tree
      - name: 'フォローチェック'
    - アンケート
      - type: message
      - name: 'アンケート'
    - 抽選
      - type: lottery
      - name: '抽選'
    - 終了トリガー
      - type: end
      - name: '終了トリガー'

- キャンペーンプライズ情報>キャンペーンテンプレート情報>最初のトリガーノード
  - in_instantwin_nodes
  - node_type: first_trigger


- キャンペーンプライズ情報>キャンペーンテンプレート情報>フォローチェック
  - in_instantwin_nodes
    - node_type: first_trigger
    - node_type: message
      - in_instantwin_message_maps 追加
    - node_type: message_select_option
    - node_type: message_select_option
    - node_type: message
      - in_instantwin_message_maps 追加
  
- キャンペーンプライズ情報>キャンペーンテンプレート情報>アンケート
  - in_instantwin_nodes
    - node_type: message
      - in_instantwin_message_maps 追加
    - node_type: message_select_option
    - node_type: message_select_option  
    - node_type: message_select_option

- キャンペーンプライズ情報>キャンペーンテンプレート情報>抽選
  - in_instantwin_nodes
    - node_type: lottery
    - node_type: lottery_message
      - in_instantwin_message_maps 追加（当選用）
    - node_type: lottery_message
      - in_instantwin_message_maps 追加（落選用）

- キャンペーンプライズ情報>キャンペーンテンプレート情報>終了
  - in_instantwin_nodes
    - node_type: message
      - in_instantwin_message_maps 追加（デフォルト終了メッセージ）
    - node_type: message
      - in_instantwin_message_maps 追加（フォローチェックいいえ用メッセージ）


  - 最初のトリガー
  - フォローチェック
    - メッセージ
      - ふぉろーしていますか？
    - メッセージ-選択肢（はい）
      - 次のグループへ
    - メッセージ-選択肢（いいえ）
      - 終了グループへ
          - フォローチェックいいえ用パターンメッセージ 
  - アンケート
    - メッセージ
      - 何色が好きですか？
      - 選択肢（赤）
        - 次のグループへ
      - 選択肢（緑）
        - 次のグループへ
      - 選択肢（黄）
        - 次のグループへ
  - 抽選
    - 抽選実行ノード
    - 当選メッセージ
      - "おめでとうございます！当選しました！" → 終了グループへ
    - 落選メッセージ
      - "残念ながら今回は落選でした。" → 終了グループへ
  - 終了グループ
    - デフォルト終了メッセージ
      - "キャンペーンにご参加いただきありがとうございました！"
    - フォローチェックいいえ用パターンメッセージ
      - "まずはアカウントをフォローしてくださいね。"


作成されるテーブル
- campaigns
- in_instantwin_prizes
- in_instantwin_templates
- in_instantwin_nodes
- in_instantwin_edges
- in_instantwin_messages
- in_instantwin_message_select_options
- in_instantwin_message_lottery


**メインSQL:**
```sql
-- 1. キャンペーン作成
INSERT INTO campaigns (title, description, status, start_date, end_date, created, modified) 
VALUES (?, ?, ?, ?, ?, NOW(), NOW());
SET @campaign_id = LAST_INSERT_ID();

-- 2. プライズ作成（1つ）
INSERT INTO in_instantwin_prizes (campaign_id, name, description, winner_count, winning_rate, created, modified)
VALUES (@campaign_id, 'デフォルト', '', 1, 100, NOW(), NOW());
SET @prize_id = LAST_INSERT_ID();

-- 3. テンプレート作成（5つ）
INSERT INTO in_instantwin_templates (prize_id, name, type, step_order, created, modified) VALUES
(@prize_id, '最初のトリガー', 'start', 1, NOW(), NOW()),
(@prize_id, 'フォローチェック', 'tree', 2, NOW(), NOW()),
(@prize_id, 'アンケート', 'message', 3, NOW(), NOW()),
(@prize_id, '抽選', 'lottery_group', 4, NOW(), NOW()),
(@prize_id, '終了トリガー', 'end', 5, NOW(), NOW());

-- 4. ノード作成
-- 最初のトリガーノード
INSERT INTO in_instantwin_nodes (template_id, prize_id, type, created, modified)
SELECT id, @prize_id, 'first_trigger', NOW(), NOW() FROM in_instantwin_templates WHERE prize_id = @prize_id AND type = 'start';

-- フォローチェックノード群
INSERT INTO in_instantwin_nodes (template_id, prize_id, type, created, modified)
SELECT t.id, @prize_id, 'message', NOW(), NOW() FROM in_instantwin_templates t WHERE t.prize_id = @prize_id AND t.type = 'tree';

INSERT INTO in_instantwin_nodes (template_id, prize_id, type, created, modified)
SELECT t.id, @prize_id, 'message_select_option', NOW(), NOW() FROM in_instantwin_templates t WHERE t.prize_id = @prize_id AND t.type = 'tree';

INSERT INTO in_instantwin_nodes (template_id, prize_id, type, created, modified)
SELECT t.id, @prize_id, 'message_select_option', NOW(), NOW() FROM in_instantwin_templates t WHERE t.prize_id = @prize_id AND t.type = 'tree';

-- アンケートノード群
INSERT INTO in_instantwin_nodes (template_id, prize_id, type, created, modified)
SELECT t.id, @prize_id, 'message', NOW(), NOW() FROM in_instantwin_templates t WHERE t.prize_id = @prize_id AND t.type = 'message';

INSERT INTO in_instantwin_nodes (template_id, prize_id, type, created, modified)
SELECT t.id, @prize_id, 'message_select_option', NOW(), NOW() FROM in_instantwin_templates t WHERE t.prize_id = @prize_id AND t.type = 'message';

INSERT INTO in_instantwin_nodes (template_id, prize_id, type, created, modified)
SELECT t.id, @prize_id, 'message_select_option', NOW(), NOW() FROM in_instantwin_templates t WHERE t.prize_id = @prize_id AND t.type = 'message';

INSERT INTO in_instantwin_nodes (template_id, prize_id, type, created, modified)
SELECT t.id, @prize_id, 'message_select_option', NOW(), NOW() FROM in_instantwin_templates t WHERE t.prize_id = @prize_id AND t.type = 'message';

-- 抽選ノード群
INSERT INTO in_instantwin_nodes (template_id, prize_id, type, created, modified)
SELECT t.id, @prize_id, 'lottery', NOW(), NOW() FROM in_instantwin_templates t WHERE t.prize_id = @prize_id AND t.type = 'lottery_group';

INSERT INTO in_instantwin_nodes (template_id, prize_id, type, created, modified)
SELECT t.id, @prize_id, 'lottery_message', NOW(), NOW() FROM in_instantwin_templates t WHERE t.prize_id = @prize_id AND t.type = 'lottery_group';

INSERT INTO in_instantwin_nodes (template_id, prize_id, type, created, modified)
SELECT t.id, @prize_id, 'lottery_message', NOW(), NOW() FROM in_instantwin_templates t WHERE t.prize_id = @prize_id AND t.type = 'lottery_group';

-- 終了ノード
INSERT INTO in_instantwin_nodes (template_id, prize_id, type, created, modified)
SELECT t.id, @prize_id, 'message', NOW(), NOW() FROM in_instantwin_templates t WHERE t.prize_id = @prize_id AND t.type = 'end';

-- 5. メッセージ作成
INSERT INTO in_instantwin_messages (node_id, prize_id, text, message_type, created, modified) VALUES
-- フォローチェック用メッセージ
((SELECT n.id FROM in_instantwin_nodes n JOIN in_instantwin_templates t ON n.template_id = t.id WHERE t.type = 'tree' AND n.type = 'message' AND t.prize_id = @prize_id LIMIT 1), @prize_id, 'フォローしていますか？', 'select', NOW(), NOW()),
-- アンケート用メッセージ  
((SELECT n.id FROM in_instantwin_nodes n JOIN in_instantwin_templates t ON n.template_id = t.id WHERE t.type = 'message' AND n.type = 'message' AND t.prize_id = @prize_id LIMIT 1), @prize_id, '何色が好きですか？', 'select', NOW(), NOW()),
-- 終了用メッセージ
((SELECT n.id FROM in_instantwin_nodes n JOIN in_instantwin_templates t ON n.template_id = t.id WHERE t.type = 'end' AND t.prize_id = @prize_id LIMIT 1), @prize_id, 'ありがとうございました！', 'text', NOW(), NOW());

-- 6. 選択肢作成
INSERT INTO in_instantwin_message_select_options (node_id, prize_id, select_option, display_order, created, modified) VALUES
-- フォローチェック選択肢
((SELECT n.id FROM in_instantwin_nodes n JOIN in_instantwin_templates t ON n.template_id = t.id WHERE t.type = 'tree' AND n.type = 'message_select_option' AND t.prize_id = @prize_id LIMIT 1 OFFSET 0), @prize_id, 'はい', 1, NOW(), NOW()),
((SELECT n.id FROM in_instantwin_nodes n JOIN in_instantwin_templates t ON n.template_id = t.id WHERE t.type = 'tree' AND n.type = 'message_select_option' AND t.prize_id = @prize_id LIMIT 1 OFFSET 1), @prize_id, 'いいえ', 2, NOW(), NOW()),
-- アンケート選択肢
((SELECT n.id FROM in_instantwin_nodes n JOIN in_instantwin_templates t ON n.template_id = t.id WHERE t.type = 'message' AND n.type = 'message_select_option' AND t.prize_id = @prize_id LIMIT 1 OFFSET 0), @prize_id, '赤', 1, NOW(), NOW()),
((SELECT n.id FROM in_instantwin_nodes n JOIN in_instantwin_templates t ON n.template_id = t.id WHERE t.type = 'message' AND n.type = 'message_select_option' AND t.prize_id = @prize_id LIMIT 1 OFFSET 1), @prize_id, '緑', 2, NOW(), NOW()),
((SELECT n.id FROM in_instantwin_nodes n JOIN in_instantwin_templates t ON n.template_id = t.id WHERE t.type = 'message' AND n.type = 'message_select_option' AND t.prize_id = @prize_id LIMIT 1 OFFSET 2), @prize_id, '黄', 3, NOW(), NOW());

-- 7. 抽選設定
INSERT INTO in_instantwin_message_lottery (prize_id, node_id, message_id, is_win, created, modified) VALUES
(@prize_id, (SELECT n.id FROM in_instantwin_nodes n JOIN in_instantwin_templates t ON n.template_id = t.id WHERE t.type = 'lottery_group' AND n.type = 'lottery_message' AND t.prize_id = @prize_id LIMIT 1 OFFSET 0), NULL, true, NOW(), NOW()),
(@prize_id, (SELECT n.id FROM in_instantwin_nodes n JOIN in_instantwin_templates t ON n.template_id = t.id WHERE t.type = 'lottery_group' AND n.type = 'lottery_message' AND t.prize_id = @prize_id LIMIT 1 OFFSET 1), NULL, false, NOW(), NOW());
```

#### リクエストボディ
```json
{
  "title": "夏のプレゼントキャンペーン",
  "description": "夏の暑さを吹き飛ばす素敵なプレゼントキャンペーン！",
  "status": "draft",
  "start_date": "2024-07-01T00:00:00.000Z",
  "end_date": "2024-07-31T23:59:59.000Z"
}
```

#### リクエストパラメータ

| フィールド | 型 | 必須 | 説明 | 制約 |
|-----------|---|------|------|------|
| `title` | string | ✓ | キャンペーンタイトル | 1-255文字 |
| `description` | string | - | キャンペーン説明 | 最大1000文字 |
| `status` | string | - | 初期ステータス | draft, active, paused, completed（デフォルト: draft） |
| `start_date` | string | - | 開始日時（ISO 8601形式） | 未来の日時 |
| `end_date` | string | - | 終了日時（ISO 8601形式） | start_dateより後の日時 |

#### Response

##### 成功時 (201 Created)
```json
{
  "success": true,
  "data": true,
  "message": "キャンペーンが正常に作成されました"
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
        "field": "title",
        "message": "タイトルは必須です"
      },
      {
        "field": "end_date",
        "message": "終了日時は開始日時より後である必要があります"
      }
    ]
  }
}
```

#### ステータスコード
- `201`: 作成成功
- `400`: バリデーションエラー
- `409`: 重複エラー（同じタイトルのキャンペーンが存在）
- `500`: サーバーエラー

---

### 4. キャンペーン更新

#### エンドポイント
```
PUT /api/campaigns/:id
```

#### 説明
既存のキャンペーン情報を更新します。

**メインSQL:**
```sql
UPDATE campaigns 
SET title = ?, description = ?, status = ?, start_date = ?, end_date = ?, modified = NOW() 
WHERE id = ?;
```

#### Request Parameters

##### Path Parameters
| Parameter | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| `id` | number | ✓ | Campaign ID | `/api/campaigns/123` |

#### Request Body
```json
{
  "title": "Spring Present Campaign (Updated)",
  "description": "Extended period! Added more amazing prizes.",
  "status": "active",
  "start_date": "2024-03-01T00:00:00.000Z",
  "end_date": "2024-04-15T23:59:59.000Z"
}
```

#### Request Parameters

| Field | Type | Required | Description | Constraints |
|-------|------|----------|-------------|-------------|
| `title` | string | - | Campaign title | 1-255 characters |
| `description` | string | - | Campaign description | Max 1000 characters |
| `status` | string | - | Status | draft, active, paused, completed |
| `start_date` | string | - | Start date (ISO 8601 format) | - |
| `end_date` | string | - | End date (ISO 8601 format) | After start_date |

#### Response

##### 成功時 (200 OK)
```json
{
  "success": true,
  "data": true,
  "message": "キャンペーンが正常に更新されました"
}
```

##### Error (404 Not Found)
```json
{
  "success": false,
  "error": {
    "code": "CAMPAIGN_NOT_FOUND",
    "message": "Campaign not found",
    "details": {
      "campaign_id": 999
    }
  }
}
```

##### Error (409 Conflict)
```json
{
  "success": false,
  "error": {
    "code": "CAMPAIGN_UPDATE_CONFLICT",
    "message": "Cannot change status of active campaign",
    "details": {
      "current_status": "active",
      "attempted_status": "draft"
    }
  }
}
```

#### Status Codes
- `200`: Updated successfully
- `400`: Validation error
- `404`: Campaign not found
- `409`: Update conflict error
- `500`: Server error

---

### 5. キャンペーン削除

#### エンドポイント
```
DELETE /api/campaigns/:id
```

#### 説明
指定されたキャンペーンを削除します。実行中のキャンペーンは削除できません。

**メインSQL:**
```sql
-- 1. キャンペーン状態確認
SELECT status FROM campaigns WHERE id = ?;

-- 2. 関連データ削除（force=trueの場合）
DELETE FROM in_instantwin_conversations WHERE campaign_id = ?;
DELETE FROM in_instantwin_lottery_results WHERE prize_id IN (SELECT id FROM in_instantwin_prizes WHERE campaign_id = ?);
DELETE FROM in_instantwin_templates WHERE prize_id IN (SELECT id FROM in_instantwin_prizes WHERE campaign_id = ?);
DELETE FROM in_instantwin_prizes WHERE campaign_id = ?;

-- 3. キャンペーン削除
DELETE FROM campaigns WHERE id = ?;
```

#### Request Parameters

##### Path Parameters
| Parameter | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| `id` | number | ✓ | Campaign ID | `/api/campaigns/123` |

##### Query Parameters (Optional)
| Parameter | Type | Description | Default | Example |
|-----------|------|-------------|---------|---------|
| `force` | boolean | Force delete flag (delete with related data) | false | `?force=true` |

#### Response

##### Success (200 OK)
```json
{
  "success": true,
  "data": {
    "deleted_campaign_id": 123,
    "deleted_related_data": {
      "prizes": 3,
      "templates": 15,
      "conversations": 245
    }
  },
  "message": "Campaign deleted successfully"
}
```

##### Error (409 Conflict)
```json
{
  "success": false,
  "error": {
    "code": "CAMPAIGN_DELETE_CONFLICT",
    "message": "Cannot delete active campaign",
    "details": {
      "campaign_id": 123,
      "current_status": "active",
      "suggestion": "Please stop the campaign before deletion"
    }
  }
}
```

#### Status Codes
- `200`: Deleted successfully
- `404`: Campaign not found
- `409`: Delete conflict error (active campaign)
- `500`: Server error

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
  "path": "/api/campaigns/123"
}
```

### 共通エラーコード

| コード | 説明 | HTTPステータス |
|--------|------|---------------|
| `VALIDATION_ERROR` | 入力値バリデーションエラー | 400 |
| `CAMPAIGN_NOT_FOUND` | キャンペーンが見つからない | 404 |
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