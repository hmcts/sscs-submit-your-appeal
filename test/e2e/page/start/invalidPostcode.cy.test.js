const language = 'cy';
const invalidPostcodeContent = require(`steps/start/invalid-postcode/content.${language}`);
const paths = require('paths');

const { test, expect } = require('@playwright/test');

test.describe(`${language.toUpperCase()} - Invalid postcode @batch-12`, () => {
  test.beforeEach('Initial navigation', async({ page }) => {
    await page.goto(paths.start.invalidPostcode);
  });

  test(`${language.toUpperCase()} - When I go to the invalid postcode page I see the page heading`, async({ page }) => {
    await expect(page.getByText(invalidPostcodeContent.title).first()).toBeVisible();
  });
});
