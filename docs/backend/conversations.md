# 会話管理API ドキュメント

## 概要
Instagramインスタントウィンキャンペーンの会話管理に関するAPIエンドポイントの詳細仕様。
会話セッションの管理、メッセージ処理、フロー実行、ユーザー状態追跡を行います。

## ベースURL
```
/api/in_instantwin_conversations
```

---

## エンドポイント一覧

### 1. 会話セッション開始

#### エンドポイント
```
POST /api/in_instantwin_conversations
```

#### 説明
新しい会話セッションを開始します。指定されたキャンペーンとプライズに基づいて、開始テンプレートからフローを実行します。

**メインSQL:**
```sql
-- 1. キャンペーンとプライズの有効性確認
SELECT c.id, c.status, c.start_date, c.end_date
FROM campaigns c
WHERE c.id = ? AND c.status = 'active'
  AND (c.start_date IS NULL OR c.start_date <= NOW())
  AND (c.end_date IS NULL OR c.end_date >= NOW());

SELECT p.id, p.campaign_id
FROM in_instantwin_prizes p
WHERE p.id = ? AND p.campaign_id = ?;

-- 2. 開始テンプレートとノードの取得
SELECT t.id, t.name, t.type
FROM in_instantwin_templates t
WHERE t.prize_id = ? AND t.type = 'start'
ORDER BY t.step_order
LIMIT 1;

SELECT n.id, n.type
FROM in_instantwin_nodes n
WHERE n.template_id = ? AND n.type = 'first_trigger'
LIMIT 1;

-- 3. 会話セッション作成
INSERT INTO in_instantwin_conversations (
  campaign_id, prize_id, template_id, current_node_id, 
  instagram_user_id, sender_id, message_text, message_timestamp,
  is_from_user, is_first_trigger, is_last_trigger, session_data,
  created, modified
) VALUES (
  ?, ?, ?, ?, ?, ?, 'セッション開始', NOW(), 
  false, true, false, JSON_OBJECT('step', 1), NOW(), NOW()
);
SET @conversation_id = LAST_INSERT_ID();

-- 4. 次のノードへの遷移情報取得
SELECT e.to_node_id, n.template_id, n.type
FROM in_instantwin_edges e
JOIN in_instantwin_nodes n ON e.to_node_id = n.id
WHERE e.from_node_id = ?
  AND (e.condition_type = 'auto' OR e.condition_type IS NULL)
LIMIT 1;

-- 5. 初期メッセージの取得
SELECT m.id, m.text, m.message_type
FROM in_instantwin_messages m
WHERE m.node_id = ?
LIMIT 1;
```

#### リクエストボディ
```json
{
  "campaign_id": 123,
  "prize_id": 456,
  "instagram_user_id": "user123456"
}
```

#### リクエストパラメータ

| フィールド | 型 | 必須 | 説明 | 制約 |
|-----------|---|------|------|------|
| `campaign_id` | number | ✓ | キャンペーンID | 有効なキャンペーンID |
| `prize_id` | number | ✓ | プライズID | キャンペーンに紐づくプライズID |
| `instagram_user_id` | string | ✓ | InstagramユーザーID | 1-255文字 |

#### レスポンス

##### 成功時 (201 Created)
```json
{
  "success": true,
  "data": {
    "conversation_id": 789,
    "current_node": {
      "id": 2,
      "template_id": 1,
      "type": "message",
      "template_name": "フォローチェック"
    },
    "message": {
      "id": 1,
      "text": "こんにちは！キャンペーンにご参加いただきありがとうございます。フォローしていますか？",
      "message_type": "select",
      "select_options": [
        {
          "id": 1,
          "node_id": 3,
          "select_option": "はい",
          "display_order": 1
        },
        {
          "id": 2,
          "node_id": 4,
          "select_option": "いいえ",
          "display_order": 2
        }
      ]
    }
  },
  "message": "会話セッションが正常に開始されました"
}
```

##### エラー時 (400 Bad Request)
```json
{
  "success": false,
  "error": {
    "code": "CAMPAIGN_NOT_ACTIVE",
    "message": "キャンペーンが開催期間外または非アクティブです",
    "details": {
      "campaign_id": 123,
      "status": "completed",
      "end_date": "2024-02-29T23:59:59.000Z"
    }
  }
}
```

#### ステータスコード
- `201`: セッション開始成功
- `400`: キャンペーン状態エラー
- `404`: キャンペーンまたはプライズが見つからない
- `409`: 重複セッションエラー
- `500`: サーバーエラー

---

### 2. メッセージ送信・フロー実行

#### エンドポイント
```
POST /api/in_instantwin_conversations/:conversationId/messages
```

#### 説明
ユーザーメッセージを処理し、フローに従って次のノードに遷移します。抽選処理や条件分岐を含む完全なフロー実行を行います。

**メインSQL:**
```sql
-- 1. 現在の会話状態取得
SELECT c.id, c.campaign_id, c.prize_id, c.template_id, c.current_node_id,
       c.session_data, n.type as current_node_type, t.type as template_type
FROM in_instantwin_conversations c
JOIN in_instantwin_nodes n ON c.current_node_id = n.id
JOIN in_instantwin_templates t ON c.template_id = t.id
WHERE c.id = ?;

-- 2. ユーザーメッセージ記録
INSERT INTO in_instantwin_conversations (
  campaign_id, prize_id, template_id, current_node_id,
  instagram_user_id, sender_id, message_text, message_timestamp,
  is_from_user, is_first_trigger, is_last_trigger, session_data,
  created, modified
) VALUES (
  ?, ?, ?, ?, ?, ?, ?, NOW(), 
  true, false, false, ?, NOW(), NOW()
);

-- 3. 次ノードの決定（条件分岐処理）
SELECT e.to_node_id, e.condition_type, e.condition_value,
       n.id, n.template_id, n.type, t.type as template_type
FROM in_instantwin_edges e
JOIN in_instantwin_nodes n ON e.to_node_id = n.id
JOIN in_instantwin_templates t ON n.template_id = t.id
WHERE e.from_node_id = ?
  AND (
    e.condition_type = 'auto' OR
    (e.condition_type = 'select_option' AND e.condition_value = ?) OR
    (e.condition_type = 'text_match' AND e.condition_value = ?)
  )
ORDER BY e.condition_type = 'auto' DESC
LIMIT 1;

-- 4. 抽選処理（lottery_nodeの場合）
SELECT p.winning_rate, p.daily_winner_count, p.send_winner_count
FROM in_instantwin_prizes p
WHERE p.id = ?;

-- 日次当選者数チェック
SELECT COUNT(*) as daily_winners
FROM in_instantwin_lottery_results lr
WHERE lr.prize_id = ? 
  AND lr.is_win = true 
  AND DATE(lr.created) = CURDATE();

-- 抽選実行と結果記録
INSERT INTO in_instantwin_lottery_results (
  prize_id, conversation_id, instagram_user_id, is_win, 
  lottery_rate, created, modified
) VALUES (?, ?, ?, ?, ?, NOW(), NOW());

-- 5. ボット応答メッセージ取得
SELECT m.id, m.text, m.message_type
FROM in_instantwin_messages m
WHERE m.node_id = ?;

-- 抽選結果に応じたメッセージ取得
SELECT ml.message_id, m.text, m.message_type
FROM in_instantwin_message_lottery ml
JOIN in_instantwin_messages m ON ml.message_id = m.id
WHERE ml.node_id = ? AND ml.is_win = ?;

-- 6. 会話状態更新
UPDATE in_instantwin_conversations 
SET current_node_id = ?, template_id = ?, session_data = ?, modified = NOW()
WHERE id = ? AND is_from_user = false 
ORDER BY created DESC LIMIT 1;

-- 7. ボット応答記録
INSERT INTO in_instantwin_conversations (
  campaign_id, prize_id, template_id, current_node_id,
  instagram_user_id, sender_id, message_text, message_timestamp,
  is_from_user, is_first_trigger, is_last_trigger, session_data,
  created, modified
) VALUES (
  ?, ?, ?, ?, ?, ?, ?, NOW(), 
  false, false, ?, ?, NOW(), NOW()
);
```

#### リクエストパラメータ

##### パスパラメータ
| パラメータ | 型 | 必須 | 説明 | 例 |
|-----------|---|------|------|---|
| `conversationId` | number | ✓ | 会話ID | `/api/in_instantwin_conversations/789/messages` |

#### リクエストボディ
```json
{
  "message_text": "はい",
  "selected_option": "はい"
}
```

#### リクエストパラメータ

| フィールド | 型 | 必須 | 説明 | 制約 |
|-----------|---|------|------|------|
| `message_text` | string | ✓ | ユーザーメッセージテキスト | 1-1000文字 |
| `selected_option` | string | - | 選択された選択肢（選択式の場合） | - |

#### レスポンス

##### 成功時 (200 OK) - 通常メッセージ
```json
{
  "success": true,
  "data": {
    "bot_response": {
      "id": 2,
      "text": "何色が好きですか？",
      "message_type": "select",
      "select_options": [
        {
          "id": 3,
          "node_id": 5,
          "select_option": "赤",
          "display_order": 1
        },
        {
          "id": 4,
          "node_id": 6,
          "select_option": "緑",
          "display_order": 2
        },
        {
          "id": 5,
          "node_id": 7,
          "select_option": "黄",
          "display_order": 3
        }
      ]
    },
    "next_node": {
      "id": 8,
      "template_id": 3,
      "type": "message",
      "template_name": "アンケート"
    },
    "is_lottery": false,
    "lottery_result": null
  }
}
```

##### 成功時 (200 OK) - 抽選実行
```json
{
  "success": true,
  "data": {
    "bot_response": {
      "id": 15,
      "text": "おめでとうございます！見事当選されました！🎉",
      "message_type": "text"
    },
    "next_node": {
      "id": 20,
      "template_id": 5,
      "type": "message",
      "template_name": "終了トリガー"
    },
    "is_lottery": true,
    "lottery_result": {
      "id": 101,
      "is_win": true,
      "lottery_rate": 10.5,
      "created": "2024-03-15T15:30:00.000Z"
    }
  }
}
```

##### エラー時 (404 Not Found)
```json
{
  "success": false,
  "error": {
    "code": "CONVERSATION_NOT_FOUND",
    "message": "指定された会話が見つかりません",
    "details": {
      "conversation_id": 999
    }
  }
}
```

##### エラー時 (409 Conflict)
```json
{
  "success": false,
  "error": {
    "code": "CONVERSATION_ALREADY_ENDED",
    "message": "この会話は既に終了しています",
    "details": {
      "conversation_id": 789,
      "ended_at": "2024-03-15T14:00:00.000Z"
    }
  }
}
```

#### ステータスコード
- `200`: メッセージ処理成功
- `400`: メッセージ形式エラー
- `404`: 会話が見つからない
- `409`: 会話状態エラー
- `500`: サーバーエラー

---

### 3. 会話履歴取得

#### エンドポイント
```
GET /api/in_instantwin_conversations/:conversationId/history
```

#### 説明
指定された会話の履歴を取得します。ユーザーとボットのやり取り、現在の状態を含む詳細情報を返します。

**メインSQL:**
```sql
-- 1. 会話履歴取得
SELECT c.id, c.campaign_id, c.prize_id, c.template_id, c.current_node_id,
       c.instagram_user_id, c.sender_id, c.message_text, c.message_timestamp,
       c.is_from_user, c.is_first_trigger, c.is_last_trigger, c.session_data,
       c.created, c.modified
FROM in_instantwin_conversations c
WHERE c.id = ? OR (
  c.campaign_id = (SELECT campaign_id FROM in_instantwin_conversations WHERE id = ? LIMIT 1)
  AND c.prize_id = (SELECT prize_id FROM in_instantwin_conversations WHERE id = ? LIMIT 1)
  AND c.instagram_user_id = (SELECT instagram_user_id FROM in_instantwin_conversations WHERE id = ? LIMIT 1)
)
ORDER BY c.created ASC;

-- 2. 現在の状態取得
SELECT c.current_node_id, c.template_id, c.session_data,
       n.type as current_node_type, t.name as template_name, t.type as template_type
FROM in_instantwin_conversations c
JOIN in_instantwin_nodes n ON c.current_node_id = n.id
JOIN in_instantwin_templates t ON c.template_id = t.id
WHERE c.id = ?
  AND c.is_from_user = false
ORDER BY c.created DESC
LIMIT 1;

-- 3. 抽選履歴取得
SELECT lr.id, lr.is_win, lr.lottery_rate, lr.created
FROM in_instantwin_lottery_results lr
WHERE lr.conversation_id IN (
  SELECT c.id FROM in_instantwin_conversations c
  WHERE c.id = ? OR (
    c.campaign_id = (SELECT campaign_id FROM in_instantwin_conversations WHERE id = ? LIMIT 1)
    AND c.prize_id = (SELECT prize_id FROM in_instantwin_conversations WHERE id = ? LIMIT 1)
    AND c.instagram_user_id = (SELECT instagram_user_id FROM in_instantwin_conversations WHERE id = ? LIMIT 1)
  )
)
ORDER BY lr.created DESC;
```

#### リクエストパラメータ

##### パスパラメータ
| パラメータ | 型 | 必須 | 説明 | 例 |
|-----------|---|------|------|---|
| `conversationId` | number | ✓ | 会話ID | `/api/in_instantwin_conversations/789/history` |

##### クエリパラメータ（オプション）
| パラメータ | 型 | 説明 | デフォルト | 例 |
|-----------|---|------|----------|---|
| `include_lottery_history` | boolean | 抽選履歴を含めるか | true | `?include_lottery_history=false` |
| `limit` | number | 取得件数制限 | 100 | `?limit=50` |
| `from_date` | string | 開始日時（ISO 8601形式） | - | `?from_date=2024-03-01T00:00:00.000Z` |

#### レスポンス

##### 成功時 (200 OK)
```json
{
  "success": true,
  "data": {
    "messages": [
      {
        "id": 1,
        "campaign_id": 123,
        "prize_id": 456,
        "template_id": 1,
        "current_node_id": 1,
        "instagram_user_id": "user123456",
        "sender_id": null,
        "message_text": "セッション開始",
        "message_timestamp": "2024-03-15T10:00:00.000Z",
        "is_from_user": false,
        "is_first_trigger": true,
        "is_last_trigger": false,
        "session_data": {
          "step": 1
        },
        "created": "2024-03-15T10:00:00.000Z",
        "modified": "2024-03-15T10:00:00.000Z"
      },
      {
        "id": 2,
        "campaign_id": 123,
        "prize_id": 456,
        "template_id": 2,
        "current_node_id": 2,
        "instagram_user_id": "user123456",
        "sender_id": null,
        "message_text": "フォローしていますか？",
        "message_timestamp": "2024-03-15T10:00:01.000Z",
        "is_from_user": false,
        "is_first_trigger": false,
        "is_last_trigger": false,
        "session_data": {
          "step": 2
        },
        "created": "2024-03-15T10:00:01.000Z",
        "modified": "2024-03-15T10:00:01.000Z"
      },
      {
        "id": 3,
        "campaign_id": 123,
        "prize_id": 456,
        "template_id": 2,
        "current_node_id": 3,
        "instagram_user_id": "user123456",
        "sender_id": 987654321,
        "message_text": "はい",
        "message_timestamp": "2024-03-15T10:01:00.000Z",
        "is_from_user": true,
        "is_first_trigger": false,
        "is_last_trigger": false,
        "session_data": {
          "step": 2,
          "follow_check": "yes"
        },
        "created": "2024-03-15T10:01:00.000Z",
        "modified": "2024-03-15T10:01:00.000Z"
      }
    ],
    "current_state": {
      "current_node_id": 8,
      "template_id": 3,
      "template_name": "アンケート",
      "template_type": "message",
      "current_node_type": "message",
      "session_data": {
        "step": 3,
        "follow_check": "yes"
      }
    },
    "lottery_history": [
      {
        "id": 101,
        "is_win": true,
        "lottery_rate": 10.5,
        "created": "2024-03-15T10:05:00.000Z"
      }
    ],
    "summary": {
      "total_messages": 15,
      "user_messages": 7,
      "bot_messages": 8,
      "lottery_attempts": 1,
      "lottery_wins": 1,
      "session_duration_minutes": 12,
      "current_template": "アンケート",
      "conversation_status": "active"
    }
  }
}
```

##### エラー時 (404 Not Found)
```json
{
  "success": false,
  "error": {
    "code": "CONVERSATION_NOT_FOUND",
    "message": "指定された会話が見つかりません",
    "details": {
      "conversation_id": 999
    }
  }
}
```

#### ステータスコード
- `200`: 取得成功
- `400`: 無効なパラメータ
- `404`: 会話が見つからない
- `500`: サーバーエラー

---

## 共通仕様

### 認証
全てのエンドポイントで認証が必要です。
```
Authorization: Bearer {access_token}
```

### レート制限
- 1分間に100リクエストまで（リアルタイム会話のため制限緩和）
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
  "path": "/api/in_instantwin_conversations/789/messages"
}
```

### 共通エラーコード

| コード | 説明 | HTTPステータス |
|--------|------|---------------|
| `VALIDATION_ERROR` | 入力値バリデーションエラー | 400 |
| `CONVERSATION_NOT_FOUND` | 会話が見つからない | 404 |
| `CAMPAIGN_NOT_FOUND` | キャンペーンが見つからない | 404 |
| `CAMPAIGN_NOT_ACTIVE` | キャンペーンが非アクティブ | 400 |
| `CONVERSATION_ALREADY_ENDED` | 会話既終了エラー | 409 |
| `LOTTERY_LIMIT_EXCEEDED` | 抽選制限超過エラー | 429 |
| `UNAUTHORIZED` | 認証エラー | 401 |
| `FORBIDDEN` | アクセス権限なし | 403 |
| `RATE_LIMIT_EXCEEDED` | レート制限超過 | 429 |
| `INTERNAL_SERVER_ERROR` | サーバー内部エラー | 500 |

### 日時形式
全ての日時はISO 8601形式（UTC）で表現されます。
```
2024-03-15T10:30:00.000Z
```

### セッションデータ形式
session_dataフィールドはJSON形式で会話の状態を管理します。
```json
{
  "step": 3,
  "follow_check": "yes",
  "survey_answers": {
    "color": "red",
    "age_group": "20s"
  },
  "lottery_attempts": 1,
  "custom_data": {}
}
```

### フロー制御ルール

#### 条件分岐タイプ (condition_type)
- `auto`: 自動遷移（条件なし）
- `select_option`: 選択肢による分岐
- `text_match`: テキスト完全一致
- `text_contains`: テキスト部分一致
- `regex_match`: 正規表現一致
- `custom_logic`: カスタムロジック

#### メッセージタイプ (message_type)
- `text`: テキストメッセージ
- `select`: 選択式メッセージ
- `card`: カード形式メッセージ
- `image`: 画像メッセージ
- `video`: 動画メッセージ

#### 抽選制限
- 日次制限: 1日あたりの最大当選者数
- 分間制限: 1分間あたりの最大抽選回数
- ユーザー制限: 1ユーザーあたりの最大抽選回数（24時間）