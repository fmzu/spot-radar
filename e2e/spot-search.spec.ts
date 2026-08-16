import { expect, test } from '@playwright/test';

test.describe('スポット周辺検索', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('ページタイトルが設定されている', async ({ page }) => {
    await expect(page).toHaveTitle('スポット周辺検索');
  });

  test('地図が表示される', async ({ page }) => {
    const map = page.locator('.leaflet-container');
    await expect(map).toBeVisible();
  });

  test('初期表示でスポット一覧が表示される', async ({ page }) => {
    // APIからの応答を待つ
    const listItem = page.locator('aside button').first();
    await expect(listItem).toBeVisible({ timeout: 10_000 });
  });

  test('半径スライダーを変更すると件数が変わる', async ({ page }) => {
    // 初期表示を待つ
    const countLabel = page.locator('aside span').filter({ hasText: /\d+件/ });
    await expect(countLabel).toBeVisible({ timeout: 10_000 });
    const initialText = await countLabel.textContent();

    // スライダーを最小値に変更
    const slider = page.locator('input[type="range"]');
    await slider.fill('0.5');

    // 件数が更新されるのを待つ（debounce分）
    await page.waitForTimeout(600);
    const updatedText = await countLabel.textContent();

    // 半径を狭めたので件数が減る（または0件）はず
    expect(updatedText).not.toEqual(initialText);
  });

  test('スポットをクリックすると地図が移動する', async ({ page }) => {
    const listItem = page.locator('aside button').first();
    await expect(listItem).toBeVisible({ timeout: 10_000 });
    await listItem.click();

    // クリック後にハイライト（bg-blue-50）が付く
    await expect(listItem).toHaveClass(/bg-blue-50/);
  });

  test('逆ジオコーディングで住所が表示される', async ({ page }) => {
    const addressArea = page.locator('header').filter({ hasText: '📍' });
    await expect(addressArea).toBeVisible({ timeout: 10_000 });
    // 住所テキストが空でないことを確認
    await expect(addressArea).not.toHaveText('📍');
  });

  test('0件の場合に案内メッセージが表示される', async ({ page }) => {
    // APIを直接呼んで0件になる座標を確認してからUI上で再現するのは複雑なので、
    // スライダーを最小にして遠い場所に移動する代わりに、APIレスポンスをモックする
    await page.route('**/spots?*', (route) =>
      route.fulfill({ status: 200, contentType: 'application/json', body: '[]' }),
    );
    await page.goto('/');
    const message = page.locator('text=この範囲にスポットが見つかりませんでした');
    await expect(message).toBeVisible({ timeout: 10_000 });
  });
});
