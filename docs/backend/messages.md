# メッセージ管理API ドキュメント

## 概要
Instagramインスタントウィンキャンペーンのメッセージ管理に関するAPIエンドポイントの詳細仕様。
ノードに紐づくメッセージの管理、選択肢、カード、ボタンの設定、多様なメッセージ形式の対応を行います。

## ベースURL
```
/api/in_instantwin_prizes/:prizeId/in_instantwin_messages
/api/in_instantwin_messages
```

---

## エンドポイント一覧

### 1. メッセージ一覧取得

#### エンドポイント
```
GET /api/in_instantwin_prizes/:prizeId/in_instantwin_messages
```

#### 説明
指定されたプライズに紐づく全メッセージの一覧を取得します。選択肢、カード、ボタン情報も含めて取得できます。

**メインSQL:**
```sql
-- メッセージ一覧取得
SELECT m.id, m.node_id, m.prize_id, m.text, m.message_type, m.created, m.modified,
       n.type as node_type, n.template_id, t.name as template_name, t.type as template_type
FROM in_instantwin_messages m
JOIN in_instantwin_nodes n ON m.node_id = n.id
JOIN in_instantwin_templates t ON n.template_id = t.id
WHERE m.prize_id = ?
ORDER BY t.step_order, n.id, m.id;

-- 関連選択肢取得
SELECT s.id, s.node_id, s.prize_id, s.select_option, s.display_order, 
       s.created, s.modified
FROM in_instantwin_message_select_options s
WHERE s.prize_id = ?
ORDER BY s.node_id, s.display_order;

-- 関連カード取得
SELECT c.id, c.message_id, c.title, c.subtitle, c.image_url, c.default_action_url,
       c.display_order, c.created, c.modified
FROM in_instantwin_message_cards c
JOIN in_instantwin_messages m ON c.message_id = m.id
WHERE m.prize_id = ?
ORDER BY c.message_id, c.display_order;

-- 関連カードボタン取得
SELECT cb.id, cb.card_id, cb.button_type, cb.title, cb.url, cb.payload,
       cb.display_order, cb.created, cb.modified
FROM in_instantwin_message_card_buttons cb
JOIN in_instantwin_message_cards c ON cb.card_id = c.id
JOIN in_instantwin_messages m ON c.message_id = m.id
WHERE m.prize_id = ?
ORDER BY cb.card_id, cb.display_order;

-- 抽選メッセージ取得
SELECT ml.id, ml.prize_id, ml.node_id, ml.message_id, ml.is_win, 
       ml.created, ml.modified, m.text, m.message_type
FROM in_instantwin_message_lottery ml
LEFT JOIN in_instantwin_messages m ON ml.message_id = m.id
WHERE ml.prize_id = ?
ORDER BY ml.node_id, ml.is_win DESC;
```

#### リクエストパラメータ

##### パスパラメータ
| パラメータ | 型 | 必須 | 説明 | 例 |
|-----------|---|------|------|---|
| `prizeId` | number | ✓ | プライズID | `/api/in_instantwin_prizes/123/in_instantwin_messages` |

##### クエリパラメータ（オプション）
| パラメータ | 型 | 説明 | デフォルト | 例 |
|-----------|---|------|----------|---|
| `include_select_options` | boolean | 選択肢情報を含めるか | true | `?include_select_options=false` |
| `include_cards` | boolean | カード情報を含めるか | true | `?include_cards=false` |
| `include_lottery` | boolean | 抽選メッセージを含めるか | true | `?include_lottery=false` |
| `message_type` | string | メッセージタイプでフィルタ | - | `?message_type=select` |
| `node_id` | number | ノードIDでフィルタ | - | `?node_id=5` |

#### レスポンス

##### 成功時 (200 OK)
```json
{
  "success": true,
  "data": {
    "in_instantwin_messages": [
      {
        "id": 1,
        "node_id": 2,
        "prize_id": 123,
        "text": "フォローしていますか？",
        "message_type": "select",
        "node_type": "message",
        "template_id": 2,
        "template_name": "フォローチェック",
        "template_type": "tree",
        "created": "2024-03-01T10:00:00.000Z",
        "modified": "2024-03-01T10:00:00.000Z"
      },
      {
        "id": 2,
        "node_id": 8,
        "prize_id": 123,
        "text": "こちらの商品についてどう思いますか？",
        "message_type": "card",
        "node_type": "message",
        "template_id": 3,
        "template_name": "アンケート",
        "template_type": "message",
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
    ],
    "in_instantwin_message_cards": [
      {
        "id": 1,
        "message_id": 2,
        "title": "新商品A",
        "subtitle": "革新的なデザインと機能",
        "image_url": "https://example.com/images/product-a.jpg",
        "default_action_url": "https://example.com/products/a",
        "display_order": 1,
        "created": "2024-03-01T10:00:00.000Z",
        "modified": "2024-03-01T10:00:00.000Z"
      }
    ],
    "in_instantwin_message_card_buttons": [
      {
        "id": 1,
        "card_id": 1,
        "button_type": "web_url",
        "title": "詳細を見る",
        "url": "https://example.com/products/a/details",
        "payload": null,
        "display_order": 1,
        "created": "2024-03-01T10:00:00.000Z",
        "modified": "2024-03-01T10:00:00.000Z"
      },
      {
        "id": 2,
        "card_id": 1,
        "button_type": "postback",
        "title": "興味あり",
        "url": null,
        "payload": "interested_product_a",
        "display_order": 2,
        "created": "2024-03-01T10:00:00.000Z",
        "modified": "2024-03-01T10:00:00.000Z"
      }
    ],
    "in_instantwin_message_lottery": [
      {
        "id": 1,
        "prize_id": 123,
        "node_id": 15,
        "message_id": 10,
        "is_win": true,
        "text": "おめでとうございます！当選しました！",
        "message_type": "text",
        "created": "2024-03-01T10:00:00.000Z",
        "modified": "2024-03-01T10:00:00.000Z"
      },
      {
        "id": 2,
        "prize_id": 123,
        "node_id": 16,
        "message_id": 11,
        "is_win": false,
        "text": "残念ながら今回は落選でした。",
        "message_type": "text",
        "created": "2024-03-01T10:00:00.000Z",
        "modified": "2024-03-01T10:00:00.000Z"
      }
    ]
  }
}
```

#### ステータスコード
- `200`: 成功
- `400`: 無効なパラメータ
- `404`: プライズが見つからない
- `500`: サーバーエラー

---

### 2. メッセージ作成

#### エンドポイント
```
POST /api/in_instantwin_messages
```

#### 説明
新しいメッセージを作成します。メッセージタイプに応じて選択肢、カード、ボタンも同時に作成できます。

**メインSQL:**
```sql
-- 1. ノードとプライズの有効性確認
SELECT n.id, n.template_id, n.prize_id, n.type, t.name as template_name
FROM in_instantwin_nodes n
JOIN in_instantwin_templates t ON n.template_id = t.id
WHERE n.id = ?;

-- 2. メッセージ作成
INSERT INTO in_instantwin_messages (node_id, prize_id, text, message_type, created, modified)
VALUES (?, ?, ?, ?, NOW(), NOW());
SET @message_id = LAST_INSERT_ID();

-- 3. メッセージタイプ別の関連要素作成
-- message_type = 'select' の場合
INSERT INTO in_instantwin_message_select_options (node_id, prize_id, select_option, display_order, created, modified)
VALUES (?, ?, ?, ?, NOW(), NOW());

-- message_type = 'card' の場合
INSERT INTO in_instantwin_message_cards (message_id, title, subtitle, image_url, default_action_url, display_order, created, modified)
VALUES (@message_id, ?, ?, ?, ?, ?, NOW(), NOW());
SET @card_id = LAST_INSERT_ID();

-- カードボタン作成
INSERT INTO in_instantwin_message_card_buttons (card_id, button_type, title, url, payload, display_order, created, modified)
VALUES (@card_id, ?, ?, ?, ?, ?, NOW(), NOW());

-- 4. 抽選メッセージの場合
INSERT INTO in_instantwin_message_lottery (prize_id, node_id, message_id, is_win, created, modified)
VALUES (?, ?, @message_id, ?, NOW(), NOW());
```

#### リクエストボディ
```json
{
  "node_id": 8,
  "text": "どの商品に興味がありますか？",
  "message_type": "card",
  "cards": [
    {
      "title": "商品A",
      "subtitle": "高品質な素材を使用",
      "image_url": "https://example.com/images/product-a.jpg",
      "default_action_url": "https://example.com/products/a",
      "buttons": [
        {
          "button_type": "web_url",
          "title": "詳細を見る",
          "url": "https://example.com/products/a/details"
        },
        {
          "button_type": "postback",
          "title": "選択する",
          "payload": "select_product_a"
        }
      ]
    }
  ]
}
```

#### リクエストパラメータ

| フィールド | 型 | 必須 | 説明 | 制約 |
|-----------|---|------|------|------|
| `node_id` | number | ✓ | ノードID | 有効なノードID |
| `text` | string | ✓ | メッセージテキスト | 1-1000文字 |
| `message_type` | string | ✓ | メッセージタイプ | text, select, card, image, video |
| `select_options` | array | - | 選択肢配列 | message_typeがselectの場合 |
| `cards` | array | - | カード配列 | message_typeがcardの場合 |
| `image_url` | string | - | 画像URL | message_typeがimageの場合 |
| `video_url` | string | - | 動画URL | message_typeがvideoの場合 |

#### レスポンス

##### 成功時 (201 Created)
```json
{
  "success": true,
  "data": true,
  "message": "メッセージが正常に作成されました"
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
        "field": "message_type",
        "message": "メッセージタイプが不正です",
        "allowed_values": ["text", "select", "card", "image", "video"]
      },
      {
        "field": "cards",
        "message": "カードタイプの場合、cards配列は必須です"
      }
    ]
  }
}
```

#### ステータスコード
- `201`: 作成成功
- `400`: バリデーションエラー
- `404`: ノードが見つからない
- `500`: サーバーエラー

---

### 3. メッセージ削除

#### エンドポイント
```
DELETE /api/in_instantwin_messages/:id
```

#### 説明
指定されたメッセージを削除します。関連する選択肢、カード、ボタンも全て削除されます。

**メインSQL:**
```sql
-- 1. メッセージ情報と依存関係確認
SELECT m.id, m.node_id, m.prize_id, m.text, m.message_type,
       COUNT(s.id) as select_options_count,
       COUNT(c.id) as cards_count,
       COUNT(ml.id) as lottery_references
FROM in_instantwin_messages m
LEFT JOIN in_instantwin_message_select_options s ON s.node_id = m.node_id
LEFT JOIN in_instantwin_message_cards c ON c.message_id = m.id
LEFT JOIN in_instantwin_message_lottery ml ON ml.message_id = m.id
WHERE m.id = ?
GROUP BY m.id;

-- 2. 関連データ削除
DELETE FROM in_instantwin_message_card_buttons 
WHERE card_id IN (SELECT id FROM in_instantwin_message_cards WHERE message_id = ?);

DELETE FROM in_instantwin_message_cards WHERE message_id = ?;

DELETE FROM in_instantwin_message_select_options 
WHERE node_id = (SELECT node_id FROM in_instantwin_messages WHERE id = ?);

-- 抽選メッセージ参照の削除（message_idをNULLに設定）
UPDATE in_instantwin_message_lottery 
SET message_id = NULL, modified = NOW()
WHERE message_id = ?;

-- 3. メッセージ削除
DELETE FROM in_instantwin_messages WHERE id = ?;

-- 4. 同ノードの他メッセージ確認
SELECT COUNT(*) as remaining_messages
FROM in_instantwin_messages 
WHERE node_id = (SELECT node_id FROM in_instantwin_messages WHERE id = ? LIMIT 1);
```

#### リクエストパラメータ

##### パスパラメータ
| パラメータ | 型 | 必須 | 説明 | 例 |
|-----------|---|------|------|---|
| `id` | number | ✓ | メッセージID | `/api/in_instantwin_messages/123` |

#### レスポンス

##### 成功時 (200 OK)
```json
{
  "success": true,
  "data": {
    "deleted_message_id": 123,
    "deleted_related_data": {
      "select_options": 3,
      "cards": 2,
      "card_buttons": 4,
      "lottery_references": 1
    },
    "node_status": {
      "node_id": 8,
      "remaining_messages": 0,
      "warning": "このノードにメッセージがなくなりました"
    }
  },
  "message": "メッセージが正常に削除されました"
}
```

##### エラー時 (409 Conflict)
```json
{
  "success": false,
  "error": {
    "code": "MESSAGE_DELETE_CONFLICT",
    "message": "使用中のメッセージは削除できません",
    "details": {
      "message_id": 123,
      "active_conversations": 5,
      "reason": "このメッセージを参照する進行中の会話があります"
    }
  }
}
```

#### ステータスコード
- `200`: 削除成功
- `404`: メッセージが見つからない
- `409`: 削除競合エラー（使用中）
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
  "path": "/api/in_instantwin_messages/123"
}
```

### 共通エラーコード

| コード | 説明 | HTTPステータス |
|--------|------|---------------|
| `VALIDATION_ERROR` | 入力値バリデーションエラー | 400 |
| `MESSAGE_NOT_FOUND` | メッセージが見つからない | 404 |
| `NODE_NOT_FOUND` | ノードが見つからない | 404 |
| `PRIZE_NOT_FOUND` | プライズが見つからない | 404 |
| `MESSAGE_DELETE_CONFLICT` | メッセージ削除競合エラー | 409 |
| `UNAUTHORIZED` | 認証エラー | 401 |
| `FORBIDDEN` | アクセス権限なし | 403 |
| `RATE_LIMIT_EXCEEDED` | レート制限超過 | 429 |
| `INTERNAL_SERVER_ERROR` | サーバー内部エラー | 500 |

### 日時形式
全ての日時はISO 8601形式（UTC）で表現されます。
```
2024-03-15T10:30:00.000Z
```

### メッセージタイプ定義

#### text
- 基本的なテキストメッセージ
- プレーンテキストのみ
- 最もシンプルな形式

#### select
- 選択式メッセージ
- ユーザーが選択肢から選択
- in_instantwin_message_select_optionsと連携

#### card
- カード形式メッセージ
- 画像、タイトル、サブタイトル、ボタンを含む
- リッチなコンテンツ表示

#### image
- 画像メッセージ
- 単一画像の表示
- image_urlフィールドを使用

#### video
- 動画メッセージ
- 動画コンテンツの埋め込み
- video_urlフィールドを使用

### カードボタンタイプ (button_type)

#### web_url
- Webページへのリンク
- urlフィールドにリンク先を指定
- 外部サイトやランディングページへの誘導

#### postback
- アプリケーション内処理
- payloadフィールドに処理内容を指定
- フロー分岐や状態変更に使用

#### phone_number
- 電話番号への発信
- urlフィールドに電話番号を指定
- "tel:+81-90-1234-5678"形式

### 選択肢設計ルール
- 1つのノードに最大10個まで
- display_orderで表示順序を制御
- select_optionは重複不可
- エッジ条件との整合性を保つ

### カード設計ルール
- 1つのメッセージに最大10枚まで
- 各カードに最大3個のボタン
- 画像URLは有効なHTTPS URLである必要
- タイトルは必須、サブタイトルは任意

### 抽選メッセージ特別仕様
- in_instantwin_message_lotteryテーブルで管理
- is_winフラグで当選/落選を区別
- 同一ノードに当選・落選両方のメッセージが必要
- 抽選ロジックで動的にメッセージを選択