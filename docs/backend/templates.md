# テンプレート管理API ドキュメント

## 概要
Instagramインスタントウィンキャンペーンのテンプレート管理に関するAPIエンドポイントの詳細仕様。
プライズに紐づくフローテンプレートの管理、ノード・エッジ関係の構築、フローグループの制御を行います。

## ベースURL
```
/api/in_instantwin_prizes/:prizeId/in_instantwin_templates
/api/in_instantwin_templates
```

---

## エンドポイント一覧

### 1. テンプレート詳細取得

#### エンドポイント
```
GET /api/in_instantwin_templates/:id
```

#### 説明
指定されたIDのテンプレート詳細情報を取得します。関連するノード、エッジ、メッセージの詳細情報も含めて取得できます。

**メインSQL:**
```sql
-- テンプレート詳細取得
SELECT t.id, t.prize_id, t.name, t.type, t.step_order, t.created, t.modified
FROM in_instantwin_templates t
WHERE t.id = ?;

-- 関連ノード詳細取得
SELECT n.id, n.template_id, n.prize_id, n.type, n.created, n.modified
FROM in_instantwin_nodes n
WHERE n.template_id = ?;

-- 関連メッセージ詳細取得
SELECT m.id, m.node_id, m.prize_id, m.text, m.message_type, m.created, m.modified
FROM in_instantwin_messages m
JOIN in_instantwin_nodes n ON m.node_id = n.id
WHERE n.template_id = ?;

-- 選択肢取得
SELECT s.id, s.node_id, s.prize_id, s.select_option, s.display_order, s.created, s.modified
FROM in_instantwin_message_select_options s
JOIN in_instantwin_nodes n ON s.node_id = n.id
WHERE n.template_id = ?
ORDER BY s.display_order;
```

#### リクエストパラメータ

##### パスパラメータ
| パラメータ | 型 | 必須 | 説明 | 例 |
|-----------|---|------|------|---|
| `id` | number | ✓ | テンプレートID | `/api/in_instantwin_templates/123` |

#### レスポンス

##### 成功時 (200 OK)
```json
{
  "success": true,
  "data": {
    "in_instantwin_template": {
      "id": 2,
      "prize_id": 123,
      "name": "フォローチェック",
      "type": "tree",
      "step_order": 2,
      "created": "2024-03-01T10:00:00.000Z",
      "modified": "2024-03-01T10:00:00.000Z",
      "in_instantwin_nodes": [
        {
          "id": 2,
          "template_id": 2,
          "prize_id": 123,
          "type": "message",
          "created": "2024-03-01T10:00:00.000Z",
          "modified": "2024-03-01T10:00:00.000Z"
        },
        {
          "id": 3,
          "template_id": 2,
          "prize_id": 123,
          "type": "message_select_option",
          "created": "2024-03-01T10:00:00.000Z",
          "modified": "2024-03-01T10:00:00.000Z"
        }
      ],
      "in_instantwin_messages": [
        {
          "id": 1,
          "node_id": 2,
          "prize_id": 123,
          "text": "フォローしていますか？",
          "message_type": "select",
          "created": "2024-03-01T10:00:00.000Z",
          "modified": "2024-03-01T10:00:00.000Z"
        }
      ],
      "in_instantwin_message_select_options": [
        {
          "id": 1,
          "node_id": 3,
          "prize_id": 123,
          "select_option": "はい",
          "display_order": 1,
          "created": "2024-03-01T10:00:00.000Z",
          "modified": "2024-03-01T10:00:00.000Z"
        },
        {
          "id": 2,
          "node_id": 4,
          "prize_id": 123,
          "select_option": "いいえ",
          "display_order": 2,
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
    "code": "TEMPLATE_NOT_FOUND",
    "message": "指定されたテンプレートが見つかりません",
    "details": {
      "template_id": 999
    }
  }
}
```

#### ステータスコード
- `200`: 成功
- `400`: 無効なID
- `404`: テンプレートが見つからない
- `500`: サーバーエラー

---

### 2. テンプレート作成

#### エンドポイント
```
POST /api/in_instantwin_prizes/:prizeId/in_instantwin_templates
```

#### 説明
指定されたプライズに新しいテンプレートを作成します。テンプレートタイプに応じてデフォルトのノード構成も同時に作成されます。

**メインSQL:**
```sql
-- 1. ステップ順序の計算
SELECT COALESCE(MAX(step_order), 0) + 1 as next_step_order
FROM in_instantwin_templates
WHERE prize_id = ?;

-- 2. テンプレート作成
INSERT INTO in_instantwin_templates (prize_id, name, type, step_order, created, modified)
VALUES (?, ?, ?, ?, NOW(), NOW());
SET @template_id = LAST_INSERT_ID();

-- 3. テンプレートタイプ別のデフォルトノード作成
-- type = 'start' の場合
INSERT INTO in_instantwin_nodes (template_id, prize_id, type, created, modified)
VALUES (@template_id, ?, 'first_trigger', NOW(), NOW());

-- type = 'tree' の場合
INSERT INTO in_instantwin_nodes (template_id, prize_id, type, created, modified) VALUES
(@template_id, ?, 'message', NOW(), NOW()),
(@template_id, ?, 'message_select_option', NOW(), NOW()),
(@template_id, ?, 'message_select_option', NOW(), NOW());

-- type = 'message' の場合
INSERT INTO in_instantwin_nodes (template_id, prize_id, type, created, modified) VALUES
(@template_id, ?, 'message', NOW(), NOW()),
(@template_id, ?, 'message_select_option', NOW(), NOW()),
(@template_id, ?, 'message_select_option', NOW(), NOW()),
(@template_id, ?, 'message_select_option', NOW(), NOW());

-- type = 'lottery_group' の場合
INSERT INTO in_instantwin_nodes (template_id, prize_id, type, created, modified) VALUES
(@template_id, ?, 'lottery', NOW(), NOW()),
(@template_id, ?, 'lottery_message', NOW(), NOW()),
(@template_id, ?, 'lottery_message', NOW(), NOW());

-- type = 'end' の場合
INSERT INTO in_instantwin_nodes (template_id, prize_id, type, created, modified)
VALUES (@template_id, ?, 'message', NOW(), NOW());
```

#### リクエストパラメータ

##### パスパラメータ
| パラメータ | 型 | 必須 | 説明 | 例 |
|-----------|---|------|------|---|
| `prizeId` | number | ✓ | プライズID | `/api/in_instantwin_prizes/123/in_instantwin_templates` |

#### リクエストボディ
```json
{
  "name": "年齢確認",
  "type": "tree",
  "step_order": 3
}
```

#### リクエストパラメータ

| フィールド | 型 | 必須 | 説明 | 制約 |
|-----------|---|------|------|------|
| `name` | string | ✓ | テンプレート名 | 1-255文字 |
| `type` | string | ✓ | テンプレートタイプ | start, tree, message, lottery_group, end |
| `step_order` | number | - | ステップ順序 | 1以上の整数（省略時は自動計算） |

#### レスポンス

##### 成功時 (201 Created)
```json
{
  "success": true,
  "data": true,
  "message": "テンプレートが正常に作成されました"
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
        "field": "type",
        "message": "テンプレートタイプが不正です",
        "allowed_values": ["start", "tree", "message", "lottery_group", "end"]
      }
    ]
  }
}
```

#### ステータスコード
- `201`: 作成成功
- `400`: バリデーションエラー
- `404`: プライズが見つからない
- `409`: 重複エラー（同じ順序のテンプレートが存在）
- `500`: サーバーエラー

---

### 3. テンプレート更新

#### エンドポイント
```
PUT /api/in_instantwin_templates/:id
```

#### 説明
既存のテンプレート情報を更新します。名前やステップ順序の変更が可能です。

**メインSQL:**
```sql
-- 1. 現在の情報確認
SELECT id, prize_id, name, type, step_order 
FROM in_instantwin_templates 
WHERE id = ?;

-- 2. ステップ順序の重複チェック
SELECT COUNT(*) as duplicate_count
FROM in_instantwin_templates 
WHERE prize_id = ? AND step_order = ? AND id != ?;

-- 3. テンプレート更新
UPDATE in_instantwin_templates 
SET name = ?, step_order = ?, modified = NOW()
WHERE id = ?;

-- 4. ステップ順序変更時の他テンプレート調整
UPDATE in_instantwin_templates 
SET step_order = step_order + 1, modified = NOW()
WHERE prize_id = ? AND step_order >= ? AND id != ?;
```

#### リクエストパラメータ

##### パスパラメータ
| パラメータ | 型 | 必須 | 説明 | 例 |
|-----------|---|------|------|---|
| `id` | number | ✓ | テンプレートID | `/api/in_instantwin_templates/123` |

#### リクエストボディ
```json
{
  "name": "年齢確認（更新版）",
  "step_order": 2
}
```

#### リクエストパラメータ

| フィールド | 型 | 必須 | 説明 | 制約 |
|-----------|---|------|------|------|
| `name` | string | - | テンプレート名 | 1-255文字 |
| `step_order` | number | - | ステップ順序 | 1以上の整数 |

#### レスポンス

##### 成功時 (200 OK)
```json
{
  "success": true,
  "data": true,
  "message": "テンプレートが正常に更新されました"
}
```

##### エラー時 (409 Conflict)
```json
{
  "success": false,
  "error": {
    "code": "TEMPLATE_UPDATE_CONFLICT",
    "message": "ステップ順序が他のテンプレートと重複しています",
    "details": {
      "step_order": 2,
      "conflicting_template_id": 456
    }
  }
}
```

#### ステータスコード
- `200`: 更新成功
- `400`: バリデーションエラー
- `404`: テンプレートが見つからない
- `409`: 更新競合エラー
- `500`: サーバーエラー

---

### 4. テンプレート削除

#### エンドポイント
```
DELETE /api/in_instantwin_templates/:id
```

#### 説明
指定されたテンプレートを削除します。関連するノード、エッジ、メッセージも全て削除されます。

**メインSQL:**
```sql
-- 1. テンプレート情報確認
SELECT id, prize_id, type, step_order 
FROM in_instantwin_templates 
WHERE id = ?;

-- 2. 関連データ削除
DELETE FROM in_instantwin_message_card_buttons 
WHERE card_id IN (
  SELECT c.id FROM in_instantwin_message_cards c 
  JOIN in_instantwin_messages m ON c.message_id = m.id 
  JOIN in_instantwin_nodes n ON m.node_id = n.id 
  WHERE n.template_id = ?
);
DELETE FROM in_instantwin_message_cards 
WHERE message_id IN (
  SELECT m.id FROM in_instantwin_messages m 
  JOIN in_instantwin_nodes n ON m.node_id = n.id 
  WHERE n.template_id = ?
);
DELETE FROM in_instantwin_message_select_options 
WHERE node_id IN (SELECT id FROM in_instantwin_nodes WHERE template_id = ?);
DELETE FROM in_instantwin_message_lottery 
WHERE node_id IN (SELECT id FROM in_instantwin_nodes WHERE template_id = ?);
DELETE FROM in_instantwin_messages 
WHERE node_id IN (SELECT id FROM in_instantwin_nodes WHERE template_id = ?);
DELETE FROM in_instantwin_edges 
WHERE from_node_id IN (SELECT id FROM in_instantwin_nodes WHERE template_id = ?)
   OR to_node_id IN (SELECT id FROM in_instantwin_nodes WHERE template_id = ?);
DELETE FROM in_instantwin_nodes WHERE template_id = ?;

-- 3. テンプレート削除
DELETE FROM in_instantwin_templates WHERE id = ?;

-- 4. ステップ順序の再調整
UPDATE in_instantwin_templates 
SET step_order = step_order - 1, modified = NOW()
WHERE prize_id = ? AND step_order > ?;
```

#### リクエストパラメータ

##### パスパラメータ
| パラメータ | 型 | 必須 | 説明 | 例 |
|-----------|---|------|------|---|
| `id` | number | ✓ | テンプレートID | `/api/in_instantwin_templates/123` |

#### レスポンス

##### 成功時 (200 OK)
```json
{
  "success": true,
  "data": {
    "deleted_template_id": 123,
    "deleted_related_data": {
      "nodes": 8,
      "edges": 5,
      "messages": 3,
      "select_options": 6
    }
  },
  "message": "テンプレートが正常に削除されました"
}
```

##### エラー時 (409 Conflict)
```json
{
  "success": false,
  "error": {
    "code": "TEMPLATE_DELETE_CONFLICT",
    "message": "必須テンプレートは削除できません",
    "details": {
      "template_id": 123,
      "template_type": "start",
      "suggestion": "startテンプレートは各プライズに必須です"
    }
  }
}
```

#### ステータスコード
- `200`: 削除成功
- `404`: テンプレートが見つからない
- `409`: 削除競合エラー（必須テンプレート）
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
  "path": "/api/in_instantwin_templates/123"
}
```

### 共通エラーコード

| コード | 説明 | HTTPステータス |
|--------|------|---------------|
| `VALIDATION_ERROR` | 入力値バリデーションエラー | 400 |
| `TEMPLATE_NOT_FOUND` | テンプレートが見つからない | 404 |
| `PRIZE_NOT_FOUND` | プライズが見つからない | 404 |
| `TEMPLATE_UPDATE_CONFLICT` | テンプレート更新競合エラー | 409 |
| `TEMPLATE_DELETE_CONFLICT` | テンプレート削除競合エラー | 409 |
| `UNAUTHORIZED` | 認証エラー | 401 |
| `FORBIDDEN` | アクセス権限なし | 403 |
| `RATE_LIMIT_EXCEEDED` | レート制限超過 | 429 |
| `INTERNAL_SERVER_ERROR` | サーバー内部エラー | 500 |

### 日時形式
全ての日時はISO 8601形式（UTC）で表現されます。
```
2024-03-15T10:30:00.000Z
```

### テンプレートタイプ定義

#### start (開始テンプレート)
- フローの開始点を定義
- 各プライズに必須（1つのみ）
- デフォルトノード: `first_trigger`

#### tree (分岐テンプレート)
- 条件分岐を含むフロー
- フォローチェック、年齢確認等に使用
- デフォルトノード: `message`, `message_select_option` (2つ)

#### message (メッセージテンプレート)
- 情報収集やアンケート用
- ユーザーからの入力を受け取る
- デフォルトノード: `message`, `message_select_option` (3つ)

#### lottery_group (抽選テンプレート)
- 抽選実行と結果表示
- 当選/落選メッセージを含む
- デフォルトノード: `lottery`, `lottery_message` (2つ)

#### end (終了テンプレート)
- フローの終了点を定義
- 各プライズに必須（1つのみ）
- デフォルトノード: `message`

### ステップ順序 (step_order)
- テンプレートの実行順序を制御
- 1から順番に実行される
- 同じプライズ内で重複不可
- 削除時は自動的に詰められる