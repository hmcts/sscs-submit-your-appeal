const paths = require('paths');

const { test } = require('@playwright/test');

test.describe('Health', () => {
  test('The API is up, healthy and responding to requests to /health', async({ page }) => {
    await page.goto(paths.health);
    await expect(page.locator('"status":"UP"')).toBeVisible();
  });
});
