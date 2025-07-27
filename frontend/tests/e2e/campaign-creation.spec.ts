import { test, expect } from '@playwright/test';

test.describe('Campaign Creation E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the application
    await page.goto('/');
    
    // Wait for the application to load
    await page.waitForSelector('h1');
  });

  test('should create a new campaign through complete flow', async ({ page }) => {
    // Step 1: Navigate to campaign creation from dashboard
    await page.click('a[href="/campaigns/create"]');
    await expect(page).toHaveURL('/campaigns/create');
    
    // Verify we're on the create page
    await expect(page.locator('h1')).toContainText('新しいキャンペーンを作成');

    // Step 2: Fill out the campaign form
    const campaignName = `テストキャンペーン ${Date.now()}`;
    const campaignDescription = 'E2Eテストで作成されたキャンペーンです';
    
    // Fill in campaign name
    await page.fill('input[id="name"]', campaignName);
    
    // Fill in description
    await page.fill('textarea[id="description"]', campaignDescription);
    
    // Set start date (today)
    const today = new Date();
    const startDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}T${String(today.getHours()).padStart(2, '0')}:${String(today.getMinutes()).padStart(2, '0')}`;
    await page.fill('input[id="start_date"]', startDate);
    
    // Set end date (next month)
    const endDate = new Date(today);
    endDate.setMonth(endDate.getMonth() + 1);
    const endDateString = `${endDate.getFullYear()}-${String(endDate.getMonth() + 1).padStart(2, '0')}-${String(endDate.getDate()).padStart(2, '0')}T${String(endDate.getHours()).padStart(2, '0')}:${String(endDate.getMinutes()).padStart(2, '0')}`;
    await page.fill('input[id="end_date"]', endDateString);

    // Step 3: Submit the form
    await page.click('button[type="submit"]');
    
    // Step 4: Verify success - should redirect to campaign detail or list
    await page.waitForURL(/\/campaigns\/\d+$|\/campaigns$/, { timeout: 10000 });
    
    // Verify the campaign was created successfully
    // If redirected to detail page, check the campaign name
    if (page.url().match(/\/campaigns\/\d+$/)) {
      await expect(page.locator('h1, h2')).toContainText(campaignName);
    } else {
      // If redirected to list page, check that the campaign appears in the list
      await expect(page.locator('table, .campaign-list')).toContainText(campaignName);
    }
  });

  test('should validate required fields in campaign creation form', async ({ page }) => {
    // Navigate to create page
    await page.click('a[href="/campaigns/create"]');
    await expect(page).toHaveURL('/campaigns/create');

    // Try to submit without filling required fields
    await page.click('button[type="submit"]');
    
    // Should show validation errors
    await expect(page.locator('.text-red-600, .text-red-500')).toBeVisible();
    
    // Fill only campaign name and try again
    await page.fill('input[id="name"]', 'テストキャンペーン');
    await page.click('button[type="submit"]');
    
    // Should still show validation errors for missing dates
    await expect(page.locator('.text-red-600, .text-red-500')).toBeVisible();
  });

  test('should navigate between campaign management pages', async ({ page }) => {
    // Start from dashboard
    await expect(page.locator('h1')).toContainText('ダッシュボード');
    
    // Navigate to campaigns list
    await page.click('a[href="/campaigns"]');
    await expect(page).toHaveURL('/campaigns');
    await expect(page.locator('h1')).toContainText('キャンペーン一覧');
    
    // Navigate to create campaign
    await page.click('a[href="/campaigns/create"]');
    await expect(page).toHaveURL('/campaigns/create');
    await expect(page.locator('h1')).toContainText('新しいキャンペーンを作成');
    
    // Cancel and go back
    await page.click('button:has-text("キャンセル")');
    await expect(page).toHaveURL('/campaigns');
  });

  test('should handle form validation for date fields', async ({ page }) => {
    await page.click('a[href="/campaigns/create"]');
    
    // Fill basic info
    await page.fill('input[id="name"]', 'バリデーションテスト');
    await page.fill('textarea[id="description"]', 'テスト説明');
    
    // Set end date before start date
    const today = new Date();
    const startDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}T10:00`;
    const endDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}T09:00`;
    
    await page.fill('input[id="start_date"]', startDate);
    await page.fill('input[id="end_date"]', endDate);
    
    // Try to submit
    await page.click('button[type="submit"]');
    
    // Should show validation error
    await expect(page.locator('.text-red-600, .text-red-500')).toContainText('終了日は開始日より後');
  });

  test('should show loading state during form submission', async ({ page }) => {
    await page.click('a[href="/campaigns/create"]');
    
    // Fill the form
    await page.fill('input[id="name"]', 'ローディングテスト');
    await page.fill('textarea[id="description"]', 'ローディング状態のテスト');
    
    const today = new Date();
    const startDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}T10:00`;
    const endDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate() + 1).padStart(2, '0')}T10:00`;
    
    await page.fill('input[id="start_date"]', startDate);
    await page.fill('input[id="end_date"]', endDate);
    
    // Submit and check for loading state
    await page.click('button[type="submit"]');
    
    // Should show loading indicator
    await expect(page.locator('button[type="submit"]:disabled')).toBeVisible();
    await expect(page.locator('.animate-spin, text:has-text("作成中")')).toBeVisible();
  });
});

test.describe('Campaign Management Integration', () => {
  test('should create and then edit a campaign', async ({ page }) => {
    // Create a campaign first
    await page.goto('/campaigns/create');
    
    const campaignName = `編集テストキャンペーン ${Date.now()}`;
    await page.fill('input[id="name"]', campaignName);
    await page.fill('textarea[id="description"]', '編集前の説明');
    
    const today = new Date();
    const startDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}T10:00`;
    const endDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate() + 7).padStart(2, '0')}T18:00`;
    
    await page.fill('input[id="start_date"]', startDate);
    await page.fill('input[id="end_date"]', endDate);
    
    await page.click('button[type="submit"]');
    
    // Wait for creation to complete and navigate to campaign detail
    await page.waitForURL(/\/campaigns\/\d+$/, { timeout: 10000 });
    
    // Navigate to edit page
    await page.click('a:has-text("編集"), button:has-text("編集")');
    await expect(page).toHaveURL(/\/campaigns\/\d+\/edit$/);
    
    // Verify form is pre-filled
    await expect(page.locator('input[id="name"]')).toHaveValue(campaignName);
    await expect(page.locator('textarea[id="description"]')).toHaveValue('編集前の説明');
    
    // Edit the campaign
    await page.fill('textarea[id="description"]', '編集後の説明');
    
    // Submit changes
    await page.click('button[type="submit"]');
    
    // Verify changes were saved
    await page.waitForURL(/\/campaigns\/\d+$/, { timeout: 10000 });
    await expect(page.locator('body')).toContainText('編集後の説明');
  });

  test('should display campaign in list after creation', async ({ page }) => {
    // Go to campaigns list to see current count
    await page.goto('/campaigns');
    const initialRows = await page.locator('tbody tr').count();
    
    // Create a new campaign
    await page.click('a[href="/campaigns/create"]');
    
    const uniqueName = `リスト表示テスト ${Date.now()}`;
    await page.fill('input[id="name"]', uniqueName);
    await page.fill('textarea[id="description"]', 'リスト表示確認用');
    
    const today = new Date();
    const startDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}T09:00`;
    const endDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate() + 30).padStart(2, '0')}T17:00`;
    
    await page.fill('input[id="start_date"]', startDate);
    await page.fill('input[id="end_date"]', endDate);
    
    await page.click('button[type="submit"]');
    
    // Navigate back to campaigns list
    await page.goto('/campaigns');
    
    // Verify the new campaign appears in the list
    await expect(page.locator('table, .campaign-list')).toContainText(uniqueName);
    
    // Verify the count increased
    const newRows = await page.locator('tbody tr').count();
    expect(newRows).toBeGreaterThan(initialRows);
  });
});