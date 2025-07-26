# バックエンドディレクトリ構成

## 概要
Instagramインスタントウィンキャンペーンツールのバックエンドディレクトリ構成と各ファイルの役割について詳細に説明します。

---

## 全体構成

```
src/server/
├── api/                     # API エンドポイント
├── middleware/              # ミドルウェア
├── services/               # ビジネスロジック
├── utils/                  # 共通ユーティリティ
├── app.ts                  # アプリケーションエントリー
└── index.ts                # サーバー起動ファイル

database/
├── migrations/             # マイグレーション
├── seeders/               # シードデータ
├── config.js              # DB設定
└── models/                # Sequelizeモデル

tests/                     # テストファイル
docs/                      # API仕様書
```

---

## APIディレクトリ (src/server/api/)

### campaigns/ - キャンペーン管理API
```
campaigns/
├── utils/                  # キャンペーン共通ユーティリティ
│   ├── campaign_validator.ts      # キャンペーンバリデーション
│   ├── campaign_helper.ts         # キャンペーンヘルパー関数
│   └── campaign_constants.ts      # キャンペーン定数
├── types/                  # キャンペーン型定義
│   ├── campaign_request.ts        # リクエスト型
│   ├── campaign_response.ts       # レスポンス型
│   └── campaign_entities.ts       # エンティティ型
├── get_campaigns_api.ts           # キャンペーン一覧取得
├── get_campaign_by_id_api.ts      # キャンペーン詳細取得
├── post_campaign_api.ts           # キャンペーン作成
├── put_campaign_api.ts            # キャンペーン更新
└── delete_campaign_api.ts         # キャンペーン削除
```

### in_instantwin_prizes/ - プライズ管理API
```
in_instantwin_prizes/
├── utils/                  # プライズ共通ユーティリティ
│   ├── prize_validator.ts         # プライズバリデーション
│   ├── prize_calculator.ts        # 当選確率計算
│   └── prize_constants.ts         # プライズ定数
├── types/                  # プライズ型定義
│   ├── prize_request.ts           # リクエスト型
│   ├── prize_response.ts          # レスポンス型
│   └── prize_entities.ts          # エンティティ型
├── get_in_instantwin_prizes_api.ts        # プライズ一覧取得
├── get_in_instantwin_prize_by_id_api.ts   # プライズ詳細取得
├── post_in_instantwin_prize_api.ts        # プライズ作成
├── put_in_instantwin_prize_api.ts         # プライズ更新
└── delete_in_instantwin_prize_api.ts      # プライズ削除
```

### in_instantwin_templates/ - テンプレート管理API
```
in_instantwin_templates/
├── utils/                  # テンプレート共通ユーティリティ
│   ├── template_validator.ts      # テンプレートバリデーション
│   ├── template_builder.ts        # テンプレート構築
│   └── template_constants.ts      # テンプレート定数
├── types/                  # テンプレート型定義
│   ├── template_request.ts        # リクエスト型
│   ├── template_response.ts       # レスポンス型
│   └── template_entities.ts       # エンティティ型
├── get_in_instantwin_template_by_id_api.ts # テンプレート詳細取得
├── post_in_instantwin_template_api.ts     # テンプレート作成
├── put_in_instantwin_template_api.ts      # テンプレート更新
└── delete_in_instantwin_template_api.ts   # テンプレート削除
```

### in_instantwin_conversations/ - 会話管理API
```
in_instantwin_conversations/
├── utils/                  # 会話共通ユーティリティ
│   ├── conversation_validator.ts  # 会話バリデーション
│   ├── conversation_processor.ts  # 会話処理
│   └── conversation_constants.ts  # 会話定数
├── types/                  # 会話型定義
│   ├── conversation_request.ts    # リクエスト型
│   ├── conversation_response.ts   # レスポンス型
│   └── conversation_entities.ts   # エンティティ型
├── post_in_instantwin_conversation_api.ts # 会話セッション開始
├── post_in_instantwin_message_api.ts      # メッセージ送信
└── get_in_instantwin_conversation_history_api.ts # 会話履歴取得
```

### in_instantwin_nodes/ - ノード管理API
```
in_instantwin_nodes/
├── utils/                  # ノード共通ユーティリティ
│   ├── node_validator.ts          # ノードバリデーション
│   ├── node_processor.ts          # ノード処理
│   └── node_constants.ts          # ノード定数
├── types/                  # ノード型定義
│   ├── node_request.ts            # リクエスト型
│   ├── node_response.ts           # レスポンス型
│   └── node_entities.ts           # エンティティ型
├── get_in_instantwin_nodes_api.ts         # ノード一覧取得
├── post_in_instantwin_node_api.ts         # ノード作成
└── put_in_instantwin_node_api.ts          # ノード更新
```

### in_instantwin_messages/ - メッセージ管理API
```
in_instantwin_messages/
├── utils/                  # メッセージ共通ユーティリティ
│   ├── message_validator.ts       # メッセージバリデーション
│   ├── message_formatter.ts       # メッセージフォーマット
│   └── message_constants.ts       # メッセージ定数
├── types/                  # メッセージ型定義
│   ├── message_request.ts         # リクエスト型
│   ├── message_response.ts        # レスポンス型
│   └── message_entities.ts        # エンティティ型
├── get_in_instantwin_messages_api.ts      # メッセージ一覧取得
├── post_in_instantwin_message_api.ts      # メッセージ作成
```

### flow/ - フロー制御API
```
flow/
├── utils/                  # フロー共通ユーティリティ
│   ├── flow_validator.ts          # フローバリデーション
│   ├── flow_executor.ts           # フロー実行エンジン
│   ├── flow_renderer.ts           # フロー描画
│   └── flow_constants.ts          # フロー定数
├── types/                  # フロー型定義
│   ├── flow_request.ts            # リクエスト型
│   ├── flow_response.ts           # レスポンス型
│   └── flow_entities.ts           # エンティティ型
└── get_flow_preview_api.ts        # フロープレビュー取得
```

---

## ミドルウェアディレクトリ (src/server/middleware/)

```
middleware/
├── validation_middleware.ts       # 入力値バリデーション
├── error_middleware.ts           # エラーハンドリング
└── logging_middleware.ts         # ログ出力
```

### 各ミドルウェアの役割

#### validation_middleware.ts
- リクエストデータの形式チェック
- Zodスキーマによるバリデーション
- 不正なデータの事前排除

#### error_middleware.ts
- アプリケーション全体のエラーハンドリング
- エラーレスポンスの統一
- ログ出力との連携

#### logging_middleware.ts
- APIアクセスログの記録
- リクエスト/レスポンスの追跡
- デバッグ情報の出力

---

## サービスディレクトリ (src/server/services/)

```
services/
├── campaign_service.ts            # キャンペーンビジネスロジック
├── in_instantwin_prize_service.ts # プライズビジネスロジック
├── in_instantwin_template_service.ts # テンプレートビジネスロジック
├── in_instantwin_conversation_service.ts # 会話ビジネスロジック
├── flow_service.ts               # フロー制御ロジック
└── lottery_service.ts            # 抽選ロジック
```

### 各サービスの役割

#### campaign_service.ts
- キャンペーンCRUD操作
- ステータス管理
- 関連データの一括操作

#### in_instantwin_prize_service.ts
- プライズ管理
- 当選確率計算
- 日次制限チェック

#### in_instantwin_template_service.ts
- テンプレート管理
- フローグループ構築
- ノード・エッジ関係の管理

#### in_instantwin_conversation_service.ts
- 会話セッション管理
- メッセージ履歴管理
- ユーザー状態追跡

#### flow_service.ts
- フロー実行制御
- ノード間遷移
- 条件分岐処理

#### lottery_service.ts
- 抽選実行
- 当選判定
- 結果記録

---

## ユーティリティディレクトリ (src/server/utils/)

```
utils/
├── database.ts                   # データベース接続・設定
├── logger.ts                     # ログ出力設定
├── response.ts                   # レスポンス形成
└── constants.ts                  # アプリケーション定数
```

### 各ユーティリティの役割

#### database.ts
- Sequelize ORM設定
- データベース接続管理
- トランザクション制御

#### logger.ts
- Winston設定
- ログレベル管理
- ファイル出力設定

#### response.ts
- 統一レスポンス形式
- エラーレスポンス構築
- ページネーション処理

#### constants.ts
- HTTP ステータスコード
- エラーメッセージ
- デフォルト値

---

## データベースディレクトリ (database/)

```
database/
├── config.js                     # データベース設定
├── models/                       # Sequelizeモデル
│   ├── index.ts                  # モデル統合
│   ├── campaigns.ts              # キャンペーンモデル
│   ├── in_instantwin_prizes.ts   # プライズモデル
│   ├── in_instantwin_templates.ts # テンプレートモデル
│   ├── in_instantwin_nodes.ts    # ノードモデル
│   ├── in_instantwin_edges.ts    # エッジモデル
│   ├── in_instantwin_messages.ts # メッセージモデル
│   ├── in_instantwin_message_select_options.ts # 選択肢モデル
│   ├── in_instantwin_message_cards.ts # カードモデル
│   ├── in_instantwin_message_card_buttons.ts # カードボタンモデル
│   ├── in_instantwin_message_lottery.ts # 抽選モデル
│   └── in_instantwin_conversations.ts # 会話モデル
├── migrations/                   # マイグレーションファイル
│   ├── 001-create-campaigns.js
│   ├── 002-create-in-instantwin-prizes.js
│   ├── 003-create-in-instantwin-templates.js
│   ├── 004-create-in-instantwin-nodes.js
│   ├── 005-create-in-instantwin-edges.js
│   ├── 006-create-in-instantwin-messages.js
│   ├── 007-create-in-instantwin-message-select-options.js
│   ├── 008-create-in-instantwin-message-cards.js
│   ├── 009-create-in-instantwin-message-card-buttons.js
│   ├── 010-create-in-instantwin-message-lottery.js
│   └── 011-create-in-instantwin-conversations.js
└── seeders/                      # シードデータ
    ├── 001-demo-campaigns.js
    ├── 002-demo-prizes.js
    └── 003-demo-templates.js
```

---

## アプリケーションファイル

### src/server/app.ts
- Express アプリケーション設定
- ミドルウェア登録
- ルート設定
- エラーハンドリング設定

### src/server/index.ts
- サーバー起動処理
- ポート設定
- グレースフルシャットダウン
- データベース接続初期化

---

## テストディレクトリ (tests/)

```
tests/
├── unit/                         # 単体テスト
│   ├── services/
│   ├── utils/
│   └── middleware/
├── integration/                  # 統合テスト
│   ├── api/
│   └── flow/
└── fixtures/                     # テストデータ
    ├── campaigns.json
    ├── prizes.json
    └── templates.json
```

---

## ドキュメントディレクトリ (docs/)

```
docs/
├── backend/                      # バックエンド仕様
│   ├── campaigns.md              # キャンペーンAPI仕様
│   ├── prizes.md                 # プライズAPI仕様
│   ├── templates.md              # テンプレートAPI仕様
│   ├── conversations.md          # 会話API仕様
│   └── directory.md              # ディレクトリ構成（このファイル）
└── api/                          # API仕様書
    └── openapi.yaml              # OpenAPI 3.0仕様
```

---

## 命名規則

### ファイル命名
- **API ファイル**: `{method}_{resource}_api.ts` (例: `get_campaigns_api.ts`)
- **サービスファイル**: `{resource}_service.ts` (例: `campaign_service.ts`)
- **モデルファイル**: `{table_name}.ts` (例: `campaigns.ts`)
- **ユーティリティファイル**: `{function}_utils.ts` または `{purpose}.ts`

### 変数・関数命名
- **camelCase** を使用
- 関数名は動詞から始める (例: `getCampaign`, `createPrize`)
- 型名は PascalCase (例: `CampaignRequest`, `PrizeResponse`)

### 定数命名
- **UPPER_SNAKE_CASE** を使用
- ファイルごとに定数をグループ化

---

## インポート規則

### インポート順序
1. Node.js 標準ライブラリ
2. サードパーティライブラリ
3. アプリケーション内部モジュール
4. 相対パス

### エイリアス設定
```typescript
// tsconfig.json で設定されたパスエイリアス
import { CampaignService } from '@server/services/campaign_service';
import { ApiResponse } from '@server/utils/response';
import { CampaignRequest } from '@types/campaign_request';
```

---

## 開発・運用指針

### コード品質
- ESLint + Prettier による自動整形
- TypeScript strict モード
- 単体テスト カバレッジ 80% 以上

### セキュリティ
- 入力値検証の徹底
- SQLインジェクション対策
- 認証・認可の実装

### パフォーマンス
- データベースクエリ最適化
- N+1 問題の回避
- 適切なインデックス設計