# フロントエンドディレクトリ構成

## 概要
Instagramインスタントウィンキャンペーンツールのフロントエンドディレクトリ構成と各ファイルの役割について詳細に説明します。
React + TypeScript + Viteによるモダンなフロントエンド構成を採用し、バックエンドAPIとの効率的な連携を実現します。

---

## 技術スタック

### Core Technologies
- **Framework**: Vue 3.3+ with Composition API
  - `<script setup>` syntax for optimal performance
  - Suspense for async component loading
  - Teleport for portal functionality
  - Built-in reactivity system with `ref` and `reactive`
  - Single File Components (SFC) with TypeScript support
- **Language**: TypeScript 5.1+ 
  - Strict mode configuration
  - Path mapping for clean imports
  - Declaration files for type safety
  - Generic type utilities
  - Vue 3 TypeScript integration
- **Build Tool**: Vite 4.4+ (Vue optimized)
  - HMR (Hot Module Replacement) with Vue 3 support
  - Tree shaking optimization
  - Code splitting with dynamic imports
  - Vue SFC preprocessing
  - CSS preprocessing (Sass/SCSS support)
- **State Management**: 
  - Pinia 2.1+ (Vue 3 official store)
  - Composable stores with TypeScript support
  - DevTools integration
  - Plugin ecosystem (persistence, etc.)
  - Modular store architecture
- **Routing**: Vue Router v4.2+
  - Composition API integration
  - Route guards and navigation guards
  - Lazy loading for code splitting
  - Dynamic routing with params
  - Nested routes and route meta
- **Styling**: 
  - Tailwind CSS 3.3+ with JIT compiler
  - Headless UI Vue 1.7+ for accessible components
  - CSS Modules and scoped styles in SFC
  - PostCSS for CSS processing
  - Custom design tokens system
- **UI Components**: 
  - Custom Design System based on Headless UI Vue
  - Composable component patterns
  - Renderless component architecture
  - Accessibility-first design (WCAG 2.1 AA)
  - Vue 3 slot system for flexibility
- **Form Handling**:
  - VeeValidate 4.11+ for Vue 3 forms
  - Yup 1.3+ / Zod 3.22+ for schema validation
  - Composition API form composables
  - Field-level validation
  - Form state management
- **Date Handling**: date-fns 2.30+
  - Immutable date operations
  - Timezone handling
  - Internationalization support
  - Vue 3 composables for date utilities
- **Charts**: Vue-ChartJS 5.2+ (Chart.js wrapper for Vue 3)
  - Reactive chart data binding
  - Composition API integration
  - TypeScript support
  - Custom chart components
- **HTTP Client**: Axios 1.5+ with Vue 3 composables
  - Request/response interceptors
  - Automatic retry logic
  - Request cancellation support
  - Vue 3 composable wrappers

### Development Tools
- **Code Quality**:
  - ESLint 8.47+ with Vue 3/TypeScript rules
  - @vue/eslint-config-typescript for Vue TypeScript linting
  - Prettier 3.0+ for code formatting
  - TypeScript ESLint for type-aware linting
  - Import sorting and organization
- **Testing**:
  - Vitest 0.34+ as test runner (Vite-native, Vue 3 optimized)
  - Vue Testing Library 7.0+ for component testing
  - @vue/test-utils 2.4+ (official Vue testing utilities)
  - Jest DOM matchers for assertions
  - User-event library for realistic interactions
  - MSW 1.3+ for API mocking
  - Playwright for E2E testing
- **Type Checking**: 
  - TypeScript strict mode enabled
  - Vue 3 TypeScript support
  - No implicit any policy
  - Exact optional property types
  - Consistent type imports
- **Pre-commit Hooks**:
  - Husky 8.0+ for Git hooks
  - lint-staged for staged file processing
  - Commitizen for conventional commits
  - Validate commit messages
- **Documentation**:
  - Storybook 7.4+ for Vue 3 component documentation
  - Histoire (Vue-native Storybook alternative)
  - Auto-generated prop tables
  - Interactive examples and controls
  - Accessibility addon for a11y testing
- **API Development**:
  - MSW (Mock Service Worker) 1.3+ for API mocking
  - OpenAPI TypeScript codegen
  - JSON Schema validation
  - Vue 3 composables for API integration
- **Performance Monitoring**:
  - Vue DevTools for Vue 3 debugging
  - Bundle analyzer integration
  - Performance budgets in CI
  - Core Web Vitals tracking
  - Vue 3 performance profiling

### Build & Deployment
- **Bundle Optimization**:
  - Rollup-based bundling via Vite
  - rollup-plugin-analyzer for bundle analysis
  - Tree shaking for dead code elimination
  - CSS minification and purging
  - Asset optimization and compression
- **Progressive Web App**:
  - Vite PWA Plugin with Workbox
  - Service worker for offline functionality
  - App manifest for installation
  - Background sync capabilities
- **Environment Management**:
  - dotenv for environment variables
  - Multiple environment configs (dev/staging/prod)
  - Feature flags support
  - Runtime configuration
- **Deployment Pipeline**:
  - Docker containerization
  - Nginx for static file serving
  - CI/CD with automated testing
  - Preview deployments for PR reviews
- **Performance Optimization**:
  - Preloading critical resources
  - Image optimization and lazy loading
  - Route-based code splitting
  - HTTP/2 server push support
- **Monitoring & Analytics**:
  - Error tracking with Sentry
  - Performance monitoring
  - User analytics integration
  - Real User Monitoring (RUM)

### Development Dependencies
- **Package Management**: pnpm 8.7+ for efficient dependency management
- **Node.js**: v18.17+ with ES2022 support
- **VS Code Extensions**: 
  - Volar (Vue Language Features) for Vue 3 support
  - TypeScript Vue Plugin (Volar) for TypeScript integration
  - Tailwind CSS IntelliSense
  - ESLint and Prettier extensions
  - GitLens for Git integration
- **Vue Development Tools**: 
  - Vue DevTools for state and component debugging
  - Pinia DevTools for store inspection
  - Vue 3 Snippets for development productivity

---

## 全体構成

```
src/
├── components/              # 再利用可能コンポーネント
│   ├── ui/                     # UI基盤コンポーネント
│   ├── business/               # ビジネスロジックコンポーネント
│   ├── forms/                  # フォーム関連コンポーネント
│   └── charts/                 # チャート・グラフコンポーネント
├── pages/                   # ページコンポーネント
│   ├── campaigns/              # キャンペーン管理画面（ダッシュボード機能含む）
│   ├── prizes/                 # プライズ管理画面
│   ├── templates/              # テンプレート管理画面
│   ├── conversations/          # 会話・チャット画面
│   └── flow-editor/            # フローエディタ画面
├── layouts/                 # レイアウトコンポーネント
│   ├── MainLayout.vue          # メインレイアウト
│   ├── AuthLayout.vue          # 認証画面レイアウト
│   └── PublicLayout.vue        # パブリック画面レイアウト
├── composables/             # Vue 3 Composables
│   ├── api/                    # API関連コンポーザブル
│   ├── ui/                     # UI関連コンポーザブル
│   └── business/               # ビジネスロジックコンポーザブル
├── stores/                  # Pinia状態管理
│   ├── modules/                # Pinia Storeモジュール
│   ├── api/                    # API Storeモジュール
│   └── plugins/                # Piniaプラグイン
├── services/                # API通信層・外部サービス
│   ├── api/                    # API クライアント
│   ├── websocket/              # WebSocket通信
│   └── external/               # 外部サービス連携
├── utils/                   # ユーティリティ関数
│   ├── formatting/             # データフォーマット関数
│   ├── validation/             # バリデーション関数
│   ├── date/                   # 日付処理関数
│   └── helpers/                # ヘルパー関数
├── types/                   # TypeScript型定義
│   ├── api/                    # API型定義
│   ├── components/             # コンポーネント型定義
│   ├── store/                  # Store型定義
│   └── business/               # ビジネスロジック型定義
├── constants/               # 定数定義
│   ├── api.ts                  # API関連定数
│   ├── ui.ts                   # UI関連定数
│   └── business.ts             # ビジネスロジック定数
├── assets/                  # 静的アセット
│   ├── images/                 # 画像ファイル
│   ├── icons/                  # アイコンファイル
│   └── fonts/                  # フォントファイル
├── styles/                  # グローバルスタイル
│   ├── globals.css             # グローバルCSS
│   ├── components.css          # コンポーネント用CSS
│   └── utilities.css           # ユーティリティCSS
├── App.vue                  # アプリケーションルート
├── main.ts                  # エントリーポイント
├── router.ts                # Vue Routerルーティング設定
└── vite-env.d.ts           # Vite型定義

public/
├── index.html              # HTMLテンプレート
├── favicon.ico             # ファビコン
├── manifest.json           # PWA設定
└── robots.txt              # SEO設定

tests/                      # テストファイル
├── __mocks__/              # モックファイル
├── fixtures/               # テストデータ
├── setup.ts                # テスト環境設定
└── utils/                  # テストユーティリティ

docs/                       # 設計書・ドキュメント
├── frontend/               # フロントエンド仕様書
└── api/                    # API仕様書

.storybook/                # Storybook設定
├── main.ts                # メイン設定
├── preview.ts             # プレビュー設定
└── manager.ts             # マネージャー設定
```

---

## ページディレクトリ (src/pages/)

### キャンペーン管理（メインダッシュボード）
```
pages/campaigns/
├── index.vue               # キャンペーン一覧画面
├── [id]/                   # 動的ルート
│   ├── index.vue               # キャンペーン詳細
│   ├── edit.vue                # キャンペーン編集
│   ├── analytics.vue           # キャンペーン分析
│   └── settings.vue            # キャンペーン設定
├── create.vue              # キャンペーン作成
├── components/             # キャンペーン専用コンポーネント
│   ├── CampaignCard.vue        # キャンペーンカード表示
│   ├── CampaignForm.vue        # キャンペーンフォーム
│   ├── CampaignFilters.vue     # フィルタ機能
│   ├── CampaignToolbar.vue     # ツールバー
│   ├── CampaignGrid.vue        # グリッド表示
│   ├── CampaignInfo.vue        # 基本情報表示
│   ├── CampaignActions.vue     # アクション群
│   └── CampaignTimeline.vue    # タイムライン表示
└── composables/            # キャンペーン専用コンポーザブル
    ├── useCampaigns.ts         # キャンペーンCRUD操作
    ├── useCampaignValidation.ts # バリデーション
    ├── useCampaignDetail.ts    # 詳細データ取得
    └── useCampaignAnalytics.ts # 分析データ取得
```

### プライズ管理
```
pages/prizes/
├── index.vue               # プライズ一覧画面
├── [id]/                   # 動的ルート
│   ├── index.vue               # プライズ詳細
│   ├── edit.vue                # プライズ編集
│   └── lottery-history.vue     # 抽選履歴
├── create.vue              # プライズ作成
├── components/             # プライズ専用コンポーネント
│   ├── PrizeCard.vue           # プライズカード表示
│   ├── PrizeForm.vue           # プライズフォーム
│   ├── PrizeFilters.vue        # フィルタ機能
│   ├── PrizeInfo.vue           # 基本情報表示
│   ├── PrizeActions.vue        # アクション群
│   ├── PrizeStats.vue          # 統計情報
│   ├── WinningRateSlider.vue   # 当選確率スライダー
│   ├── LotterySettings.vue     # 抽選設定パネル
│   ├── LotteryHistory.vue      # 抽選履歴表示
│   └── WinningRateChart.vue    # 当選率チャート
└── composables/            # プライズ専用コンポーザブル
    ├── usePrizes.ts            # プライズCRUD操作
    ├── usePrizeDetail.ts       # 詳細データ取得
    ├── useLotteryCalculation.ts # 抽選確率計算
    └── useLotteryHistory.ts    # 抽選履歴取得
```

### テンプレート管理
```
pages/templates/
├── index.vue               # テンプレート一覧画面
├── [id]/                   # 動的ルート
│   ├── index.vue               # テンプレート詳細
│   ├── edit.vue                # テンプレート編集
│   └── nodes/                  # ノード管理
│       ├── [nodeId]/
│       │   └── edit.vue            # ノード編集
│       └── create.vue              # ノード作成
├── create.vue              # テンプレート作成
├── components/             # テンプレート専用コンポーネント
│   ├── TemplateCard.vue        # テンプレートカード
│   ├── TemplateForm.vue        # テンプレートフォーム
│   ├── TemplateFilters.vue     # フィルタ機能
│   ├── TemplateInfo.vue        # 基本情報表示
│   ├── TemplateNodes.vue       # ノード構成表示
│   ├── TemplateFlow.vue        # フロー表示
│   ├── TemplateActions.vue     # アクション群
│   ├── TemplateStats.vue       # 統計情報
│   ├── TemplateTypeSelector.vue # タイプ選択
│   ├── StepOrderSelector.vue   # ステップ順序選択
│   ├── NodeCard.vue            # ノードカード
│   └── RelatedTemplates.vue    # 関連テンプレート
└── composables/            # テンプレート専用コンポーザブル
    ├── useTemplates.ts         # テンプレートCRUD操作
    ├── useTemplateDetail.ts    # 詳細データ取得
    ├── useTemplateValidation.ts # バリデーション
    └── useTemplateNodes.ts     # ノード管理
```

### フローエディタ
```
pages/flow-editor/
├── index.vue               # フローエディタメイン画面
├── components/             # フローエディタ専用コンポーネント
│   ├── FlowCanvas.vue          # メインキャンバス
│   ├── FlowNode.vue            # フローノード
│   ├── FlowEdge.vue            # フローエッジ
│   ├── NodePalette.vue         # ノードパレット
│   ├── PropertyPanel.vue       # プロパティパネル
│   ├── FlowEditorToolbar.vue   # エディタツールバー
│   ├── FlowMiniMap.vue         # ミニマップ
│   ├── FlowPreviewModal.vue    # プレビューモーダル
│   ├── NodeEditModal.vue       # ノード編集モーダル
│   ├── EdgeEditModal.vue       # エッジ編集モーダル
│   ├── GridBackground.vue      # グリッド背景
│   ├── SelectionBox.vue        # 選択範囲
│   ├── ViewportControls.vue    # ビューポート制御
│   ├── MessageNodeProperties.vue # メッセージノードプロパティ
│   ├── SelectOptionProperties.vue # 選択肢プロパティ
│   ├── LotteryNodeProperties.vue # 抽選ノードプロパティ
│   └── EdgeProperties.vue      # エッジプロパティ
└── composables/            # フローエディタ専用コンポーザブル
    ├── useFlowEditor.ts        # フローエディタ制御
    ├── useNodeManagement.ts    # ノード管理
    ├── useEdgeManagement.ts    # エッジ管理
    ├── useFlowValidation.ts    # フロー検証
    ├── useKeyboardShortcuts.ts # キーボードショートカット
    └── useFlowPreview.ts       # プレビュー機能
```

### 会話・チャット
```
pages/conversations/
├── index.vue               # 会話一覧画面
├── [id]/                   # 動的ルート
│   └── index.vue               # 会話詳細・チャット画面
├── components/             # 会話専用コンポーネント
│   ├── ConversationFilters.vue # フィルタ機能
│   ├── ConversationStats.vue   # 統計表示
│   ├── ConversationList.vue    # 会話リスト
│   ├── ConversationListItem.vue # 会話リストアイテム
│   ├── ChatWindow.vue          # チャット表示
│   ├── MessageBubble.vue       # メッセージバブル
│   ├── FlowProgress.vue        # フロー進行表示
│   ├── UserInfo.vue            # ユーザー情報
│   ├── ConversationActions.vue # アクション群
│   ├── LotteryHistory.vue      # 抽選履歴
│   └── ConnectionStatus.vue    # 接続状態表示
└── composables/            # 会話専用コンポーザブル
    ├── useConversations.ts     # 会話データ取得
    ├── useConversationDetail.ts # 詳細データ取得
    ├── useConversationHistory.ts # 履歴取得
    ├── useRealTimeChat.ts      # リアルタイムチャット
    ├── useWebSocket.ts         # WebSocket通信
    └── useMessageHistory.ts    # メッセージ履歴
```

---

## コンポーネントディレクトリ (src/components/)

### UI基盤コンポーネント (src/components/ui/)
```
components/ui/
├── Button/                 # ボタンコンポーネント
│   ├── Button.vue              # メインボタン
│   ├── Button.types.ts         # 型定義
│   ├── Button.stories.ts       # Storybook (Vue 3対応)
│   ├── Button.test.ts          # テスト (Vue 3対応)
│   └── index.ts                # エクスポート
├── Input/                  # 入力コンポーネント
│   ├── Input.vue               # 基本入力
│   ├── TextArea.vue            # テキストエリア
│   ├── Select.vue              # セレクト
│   ├── NumberInput.vue         # 数値入力
│   ├── SearchInput.vue         # 検索入力
│   ├── DatePicker.vue          # 日付選択
│   ├── DateTimePicker.vue      # 日時選択
│   ├── DateRangePicker.vue     # 期間選択
│   ├── Input.types.ts          # 型定義
│   ├── Input.stories.ts        # Storybook (Vue 3対応)
│   ├── Input.test.ts           # テスト (Vue 3対応)
│   └── index.ts                # エクスポート
├── Modal/                  # モーダルコンポーネント
│   ├── Modal.vue               # 基本モーダル
│   ├── ConfirmModal.vue        # 確認モーダル
│   ├── FormModal.vue           # フォームモーダル
│   ├── Modal.types.ts          # 型定義
│   ├── Modal.stories.ts        # Storybook (Vue 3対応)
│   ├── Modal.test.ts           # テスト (Vue 3対応)
│   └── index.ts                # エクスポート
├── Table/                  # テーブルコンポーネント
│   ├── Table.vue               # 基本テーブル
│   ├── DataTable.vue           # データテーブル
│   ├── PaginatedTable.vue      # ページネーション付き
│   ├── Table.types.ts          # 型定義
│   ├── Table.stories.ts        # Storybook (Vue 3対応)
│   ├── Table.test.ts           # テスト (Vue 3対応)
│   └── index.ts                # エクスポート
├── Form/                   # フォームコンポーネント
│   ├── FormField.vue           # フォームフィールド
│   ├── FormSection.vue         # フォームセクション
│   ├── FormActions.vue         # フォームアクション
│   ├── Form.types.ts           # 型定義
│   ├── Form.stories.ts         # Storybook (Vue 3対応)
│   ├── Form.test.ts            # テスト (Vue 3対応)
│   └── index.ts                # エクスポート
├── Layout/                 # レイアウトコンポーネント
│   ├── PageLayout.vue          # ページレイアウト
│   ├── Card.vue                # カード
│   ├── Container.vue           # コンテナ
│   ├── Grid.vue                # グリッド
│   ├── Stack.vue               # スタック
│   ├── Divider.vue             # 区切り線
│   ├── Layout.types.ts         # 型定義
│   ├── Layout.stories.ts       # Storybook (Vue 3対応)
│   ├── Layout.test.ts          # テスト (Vue 3対応)
│   └── index.ts                # エクスポート
├── Navigation/             # ナビゲーションコンポーネント
│   ├── Breadcrumb.vue          # パンくずリスト
│   ├── Pagination.vue          # ページネーション
│   ├── Tabs.vue                # タブ
│   ├── Menu.vue                # メニュー
│   ├── DropdownMenu.vue        # ドロップダウンメニュー
│   ├── Navigation.types.ts     # 型定義
│   ├── Navigation.stories.ts   # Storybook (Vue 3対応)
│   ├── Navigation.test.ts      # テスト (Vue 3対応)
│   └── index.ts                # エクスポート
├── Feedback/               # フィードバックコンポーネント
│   ├── Toast.vue               # トースト通知
│   ├── Alert.vue               # アラート
│   ├── Badge.vue               # バッジ
│   ├── Tooltip.vue             # ツールチップ
│   ├── Popover.vue             # ポップオーバー
│   ├── LoadingSpinner.vue      # ローディング
│   ├── Progress.vue            # プログレスバー
│   ├── Skeleton.vue            # スケルトン
│   ├── Feedback.types.ts       # 型定義
│   ├── Feedback.stories.ts     # Storybook (Vue 3対応)
│   ├── Feedback.test.ts        # テスト (Vue 3対応)
│   └── index.ts                # エクスポート
└── Controls/               # 制御コンポーネント
    ├── Toggle.vue              # トグル
    ├── Checkbox.vue            # チェックボックス
    ├── Radio.vue               # ラジオボタン
    ├── Slider.vue              # スライダー
    ├── RangeSlider.vue         # レンジスライダー
    ├── Switch.vue              # スイッチ
    ├── Controls.types.ts       # 型定義
    ├── Controls.stories.ts     # Storybook (Vue 3対応)
    ├── Controls.test.ts        # テスト (Vue 3対応)
    └── index.ts                # エクスポート
```

### ビジネスロジックコンポーネント (src/components/business/)
```
components/business/
├── Campaign/               # キャンペーン関連コンポーネント
│   ├── StatusBadge.vue         # ステータスバッジ
│   ├── CampaignCard.vue        # キャンペーンカード
│   ├── CampaignTimer.vue       # キャンペーンタイマー
│   └── index.ts                # エクスポート
├── Prize/                  # プライズ関連コンポーネント
│   ├── WinningRateDisplay.vue  # 当選確率表示
│   ├── PrizeCard.vue           # プライズカード
│   ├── LotteryResults.vue      # 抽選結果表示
│   └── index.ts                # エクスポート
├── Template/               # テンプレート関連コンポーネント
│   ├── TemplateTypeIcon.vue    # テンプレートタイプアイコン
│   ├── StepIndicator.vue       # ステップインジケーター
│   └── index.ts                # エクスポート
├── Flow/                   # フロー関連コンポーネント
│   ├── FlowVisualization.vue   # フロー可視化
│   ├── NodeConnector.vue       # ノード接続
│   ├── FlowProgress.vue        # フロー進行表示
│   └── index.ts                # エクスポート
├── Conversation/           # 会話関連コンポーネント
│   ├── MessageStatus.vue       # メッセージ状態
│   ├── UserAvatar.vue          # ユーザーアバター
│   ├── ConversationStatus.vue  # 会話状態
│   └── index.ts                # エクスポート
└── Analytics/              # 分析関連コンポーネント
    ├── MetricsChart.vue        # メトリクスチャート
    ├── PerformanceGraph.vue    # パフォーマンスグラフ
    ├── StatsCard.vue           # 統計カード
    └── index.ts                # エクスポート
```

### チャートコンポーネント (src/components/charts/)
```
components/charts/
├── LineChart.vue           # 線グラフ
├── BarChart.vue            # 棒グラフ
├── PieChart.vue            # 円グラフ
├── AreaChart.vue           # エリアチャート
├── DonutChart.vue          # ドーナツチャート
├── ScatterChart.vue        # 散布図
├── HeatMap.vue             # ヒートマップ
├── TreeMap.vue             # ツリーマップ
├── Chart.types.ts          # 型定義
├── Chart.utils.ts          # ユーティリティ
├── Chart.stories.ts        # Storybook (Vue 3対応)
├── Chart.test.ts           # テスト (Vue 3対応)
└── index.ts                # エクスポート
```

---

## コンポーネントディレクトリ (src/components/)

### UI基盤コンポーネント
```
components/ui/
├── Button/                 # ボタンコンポーネント
│   ├── Button.tsx              # メインボタン
│   ├── Button.types.ts         # 型定義
│   ├── Button.stories.tsx      # Storybook
│   └── Button.test.tsx         # テスト
├── Input/                  # 入力コンポーネント
│   ├── Input.tsx
│   ├── TextArea.tsx
│   ├── Select.tsx
│   └── NumberInput.tsx
├── Modal/                  # モーダルコンポーネント
│   ├── Modal.tsx
│   ├── ConfirmModal.tsx
│   └── FormModal.tsx
├── Table/                  # テーブルコンポーネント
│   ├── Table.tsx
│   ├── DataTable.tsx
│   └── PaginatedTable.tsx
├── Form/                   # フォームコンポーネント
│   ├── FormField.tsx
│   ├── FormSection.tsx
│   └── FormActions.tsx
└── Layout/                 # レイアウトコンポーネント
    ├── Header.tsx
    ├── Sidebar.tsx
    ├── Footer.tsx
    └── Container.tsx
```

### ビジネスロジックコンポーネント
```
components/business/
├── CampaignStatus/         # キャンペーン状態表示
│   ├── StatusIndicator.tsx
│   └── StatusToggle.tsx
├── LotteryDisplay/         # 抽選表示
│   ├── WinningRate.tsx
│   └── LotteryResults.tsx
├── FlowVisualization/      # フロー可視化
│   ├── FlowDiagram.tsx
│   └── NodeConnector.tsx
└── Analytics/              # 分析表示
    ├── MetricsChart.tsx
    └── PerformanceGraph.tsx
```

---

## 状態管理 (src/store/)

### Redux Store構成
```
store/
├── index.ts                # Store設定
├── middleware.ts           # カスタムミドルウェア
├── slices/                 # Redux Toolkit Slices
│   ├── authSlice.ts            # 認証状態
│   ├── campaignsSlice.ts       # キャンペーン状態
│   ├── prizesSlice.ts          # プライズ状態
│   ├── templatesSlice.ts       # テンプレート状態
│   ├── conversationsSlice.ts   # 会話状態
│   ├── flowEditorSlice.ts      # フローエディタ状態
│   └── uiSlice.ts              # UI状態
└── api/                    # RTK Query API
    ├── baseApi.ts              # ベースAPI設定
    ├── campaignApi.ts          # キャンペーンAPI
    ├── prizeApi.ts             # プライズAPI
    ├── templateApi.ts          # テンプレートAPI
    └── conversationApi.ts      # 会話API
```

---

## API通信層 (src/services/)

### API Service構成
```
services/
├── api.ts                  # API基盤設定
├── types/                  # API型定義
│   ├── common.ts               # 共通型
│   ├── campaign.ts             # キャンペーン型
│   ├── prize.ts                # プライズ型
│   ├── template.ts             # テンプレート型
│   └── conversation.ts         # 会話型
├── endpoints/              # APIエンドポイント
│   ├── campaigns.ts            # キャンペーンAPI
│   ├── prizes.ts               # プライズAPI
│   ├── templates.ts            # テンプレートAPI
│   └── conversations.ts        # 会話API
└── utils/                  # API ユーティリティ
    ├── errorHandler.ts         # エラーハンドリング
    ├── requestInterceptor.ts   # リクエスト前処理
    └── responseTransformer.ts  # レスポンス変換
```

---

## カスタムフック (src/hooks/)

### 共通フック
```
hooks/
├── useApi.ts               # API通信フック
├── useAuth.ts              # 認証フック
├── useLocalStorage.ts      # ローカルストレージ
├── useDebounce.ts          # デバウンス処理
├── usePagination.ts        # ページネーション
├── useModal.ts             # モーダル制御
├── useForm.ts              # フォーム制御
└── useWebSocket.ts         # WebSocket通信
```

---

## ルーティング構成

### React Router設定
```typescript
// App.tsx
const routes = [
  {
    path: '/',
    element: <DashboardLayout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'campaigns', element: <CampaignsLayout /> },
      { path: 'campaigns/:id', element: <CampaignDetail /> },
      { path: 'campaigns/:id/edit', element: <CampaignEdit /> },
      { path: 'campaigns/create', element: <CampaignCreate /> },
      { path: 'prizes', element: <PrizesLayout /> },
      { path: 'prizes/:id', element: <PrizeDetail /> },
      { path: 'templates', element: <TemplatesLayout /> },
      { path: 'flow-editor', element: <FlowEditor /> },
      { path: 'conversations', element: <ConversationsLayout /> },
      { path: 'conversations/:id', element: <ConversationDetail /> },
    ]
  },
  { path: '/login', element: <Login /> },
  { path: '*', element: <NotFound /> }
];
```

---

## 型定義 (src/types/)

### TypeScript型構成
```
types/
├── index.ts                # 型エクスポート
├── api.ts                  # API関連型
├── components.ts           # コンポーネント型
├── store.ts                # Store型
├── routing.ts              # ルーティング型
└── business/               # ビジネスロジック型
    ├── campaign.ts             # キャンペーン型
    ├── prize.ts                # プライズ型
    ├── template.ts             # テンプレート型
    ├── conversation.ts         # 会話型
    └── flow.ts                 # フロー型
```

---

## スタイリング (src/styles/)

### CSS構成
```
styles/
├── globals.css             # グローバルスタイル
├── tailwind.css            # Tailwind base
├── components.css          # コンポーネントスタイル
├── utilities.css           # ユーティリティクラス
└── themes/                 # テーマ設定
    ├── light.css               # ライトテーマ
    └── dark.css                # ダークテーマ
```

---

## 開発・ビルド設定

### Vite設定 (vite.config.ts)
```typescript
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@store': path.resolve(__dirname, './src/store'),
      '@services': path.resolve(__dirname, './src/services'),
      '@types': path.resolve(__dirname, './src/types'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@assets': path.resolve(__dirname, './src/assets'),
    }
  },
  server: {
    proxy: {
      '/api': 'http://localhost:3001'
    }
  }
});
```

### TypeScript設定 (tsconfig.json)
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@components/*": ["./src/components/*"],
      "@pages/*": ["./src/pages/*"],
      "@hooks/*": ["./src/hooks/*"],
      "@store/*": ["./src/store/*"],
      "@services/*": ["./src/services/*"],
      "@types/*": ["./src/types/*"],
      "@utils/*": ["./src/utils/*"],
      "@assets/*": ["./src/assets/*"]
    }
  }
}
```

---

## 命名規則

### ファイル命名
- **コンポーネント**: PascalCase (例: `UserProfile.tsx`)
- **フック**: camelCase + use prefix (例: `useUserData.ts`)
- **ユーティリティ**: camelCase (例: `formatDate.ts`)
- **定数**: UPPER_SNAKE_CASE (例: `API_ENDPOINTS.ts`)

### 変数・関数命名
- **コンポーネント**: PascalCase (例: `UserProfile`)
- **関数・変数**: camelCase (例: `handleSubmit`, `userData`)
- **型定義**: PascalCase (例: `UserData`, `ApiResponse`)
- **定数**: UPPER_SNAKE_CASE (例: `MAX_RETRY_COUNT`)

---

## 開発ガイドライン

### コンポーネント設計
- 単一責任の原則を守る
- Propsの型を明確に定義
- デフォルトプロパティを設定
- 再利用性を重視した設計

### 状態管理
- ローカル状態とグローバル状態を適切に分離
- Redux Toolkitのベストプラクティスに従う
- 非同期処理はRTK Queryを使用
- 楽観的更新でUX向上

### パフォーマンス
- React.memoで不要な再レンダリングを防止
- useMemo, useCallbackで計算コストを削減
- 仮想化でリスト表示を最適化
- コード分割で初期ロード時間短縮

### テスト
- コンポーネントの単体テスト
- カスタムフックのテスト
- APIモック化による統合テスト
- E2Eテストで重要フローを検証

---

## セキュリティ

### 認証・認可
- JWTトークンによる認証
- リフレッシュトークンでセキュリティ向上
- ルートガードで未認証アクセスを防止
- 権限ベースの画面制御

### データ保護
- XSS対策（DOMPurifyによるサニタイズ）
- CSRF対策（CSRFトークン）
- 機密データの暗号化
- ローカルストレージの適切な使用