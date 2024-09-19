/* eslint-disable no-process-env */
const paths = require('../../../paths');

const { test, expect } = require('@playwright/test');
const config = require('config');

/* eslint-disable-next-line no-process-env */
const baseUrl = process.env.TEST_URL || config.get('e2e.frontendUrl');

test.describe('Health', () => {
  test('The API is up, healthy and responding to requests to /health @smoke', async({
    page
  }) => {
    await page.goto(baseUrl + paths.health);
    await expect(page.getByText('"status":"UP"').first()).toBeVisible();
  });
});
