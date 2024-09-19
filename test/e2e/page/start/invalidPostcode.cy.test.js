const language = 'cy';
const invalidPostcodeContent = require(`../../../../steps/start/invalid-postcode/content.${language}`);
const paths = require('../../../../paths');

const { test, expect } = require('@playwright/test');
const { config } = require('config');

/* eslint-disable-next-line no-process-env */
const baseUrl = process.env.TEST_URL || config.get('e2e.frontendUrl');

test.describe(`${language.toUpperCase()} - Invalid postcode @batch-12`, () => {
  test.beforeEach('Initial navigation', async({ page }) => {
    await page.goto(baseUrl + paths.start.invalidPostcode);
  });

  test(`${language.toUpperCase()} - When I go to the invalid postcode page I see the page heading`, async({ page }) => {
    await expect(page.getByText(invalidPostcodeContent.title).first()).toBeVisible();
  });
});
