const language = 'cy';
const cookiePolicyContent = require(`steps/policy-pages/cookie-policy/content.${language}`);
const paths = require('paths');

const { test } = require('@playwright/test');

test.describe(`${language.toUpperCase()} - Cookie policy @batch-10`, () => {
  test(`${language.toUpperCase()} - When I go to the cookie policy page, I see the page heading`, ({ page }) => {
    page.goto(paths.policy.cookiePolicy);
    expect(page.getByText(cookiePolicyContent.cookies.title)).toBeVisible();
  });
});
