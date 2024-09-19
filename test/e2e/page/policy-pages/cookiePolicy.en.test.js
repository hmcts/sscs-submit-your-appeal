const language = 'en';
const cookiePolicyContent = require(`../../../../steps/policy-pages/cookie-policy/content.${language}`);
const paths = require('../../../../paths');

const { test, expect } = require('@playwright/test');
const { config } = require('config');

/* eslint-disable-next-line no-process-env */
const baseUrl = process.env.TEST_URL || config.get('e2e.frontendUrl');

test.describe(`${language.toUpperCase()} - Cookie policy @batch-10`, () => {
  test(`${language.toUpperCase()} - When I go to the cookie policy page, I see the page heading`, async({ page }) => {
    await page.goto(baseUrl + paths.policy.cookiePolicy);
    await expect(page.getByText(cookiePolicyContent.cookies.title).first()).toBeVisible();
  });
});
