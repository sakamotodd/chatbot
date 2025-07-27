# E2E Testing Guide

## Overview

このプロジェクトではPlaywrightを使用してE2Eテストを実装しています。キャンペーン作成機能の包括的なテストが含まれています。

## セットアップ

### 前提条件

- Node.js 18以上
- npm 9以上

### 初期設定

```bash
# 依存関係をインストール
npm install

# Playwrightブラウザをインストール
npx playwright install
```

## テスト実行

### 基本的な実行方法

```bash
# すべてのE2Eテストを実行（ヘッドレスモード）
npm run test:e2e

# UIモードで実行（対話的にテスト結果を確認）
npm run test:e2e:ui

# デバッグモードで実行（ステップバイステップ実行）
npm run test:e2e:debug

# 特定のテストファイルのみ実行
npm run test:e2e tests/e2e/campaign-creation.spec.ts

# テストレポートを表示
npm run test:e2e:report
```

### ブラウザ別実行

```bash
# Chromiumのみで実行
npx playwright test --project=chromium

# Firefoxのみで実行
npx playwright test --project=firefox

# Webkitのみで実行
npx playwright test --project=webkit
```

## テスト内容

### キャンペーン作成E2Eテスト (`tests/e2e/campaign-creation.spec.ts`)

以下のシナリオをテストしています：

1. **基本的なキャンペーン作成フロー**
   - ダッシュボードからキャンペーン作成ページへの遷移
   - フォームへの入力
   - キャンペーンの作成
   - 成功時のリダイレクト確認

2. **バリデーション機能**
   - 必須フィールドの検証
   - 日付フィールドの検証（終了日が開始日より後）

3. **ナビゲーション機能**
   - ページ間の遷移
   - キャンセル機能

4. **ユーザビリティ**
   - ローディング状態の表示
   - エラーメッセージの表示

5. **統合テスト**
   - キャンペーン作成後の編集機能
   - キャンペーン一覧での表示確認

## 開発時の注意事項

### テスト環境

- テストは開発サーバー (localhost:5173) で実行されます
- バックエンドAPIが正常に動作している必要があります
- テストデータは実際のデータベースに保存されます（テスト後のクリーンアップを考慮してください）

### トラブルシューティング

#### テストが失敗する場合

1. **開発サーバーが起動していない**
   ```bash
   npm run dev
   ```

2. **ブラウザが古い**
   ```bash
   npx playwright install
   ```

3. **ポート競合**
   - 5173ポートが使用中でないか確認
   - 必要に応じてViteの設定を変更

#### デバッグ方法

1. **スクリーンショット確認**
   - 失敗時のスクリーンショットは `test-results/` フォルダに保存されます

2. **トレース機能**
   ```bash
   npm run test:e2e:debug
   ```

3. **ヘッドフルモードで実行**
   ```bash
   npx playwright test --headed
   ```

## CI/CD統合

### GitHub Actions

```yaml
- name: Install dependencies
  run: npm ci

- name: Install Playwright
  run: npx playwright install --with-deps

- name: Run E2E tests
  run: npm run test:e2e
```

### 環境変数

本番環境やCI環境では以下の環境変数を設定：

- `CI=true` - リトライ回数やワーカー数を調整
- `PLAYWRIGHT_BROWSERS_PATH` - ブラウザキャッシュパス（オプション）

## 新しいテストの追加

### テストファイル作成

```typescript
import { test, expect } from '@playwright/test';

test.describe('新機能のテスト', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('新機能が正常に動作する', async ({ page }) => {
    // テストコードを記述
  });
});
```

### ベストプラクティス

1. **テストの独立性** - 各テストは他のテストに依存しない
2. **データクリーンアップ** - テスト後は作成したデータを削除
3. **適切な待機** - 要素の読み込み完了を適切に待機
4. **意味のあるアサーション** - ユーザーが期待する動作を検証

## 更新履歴

- v1.0.0 - 初回リリース、キャンペーン作成E2Eテスト実装