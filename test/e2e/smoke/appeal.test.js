const content = require('commonContent');
const {
  enterDetailsFromStartToNINO
} = require('../page-objects/cya/checkYourAppeal');
const { test } = require('@playwright/test');

const language = 'en';
const commonContent = content[language];
test.describe(`${language.toUpperCase()} - Full Journey`, () => {
  test(
    `${language.toUpperCase()} - Appellant full journey from /start-an-appeal to the /check-your-appeal page`,
    { tag: '@smoke' },
    async({ page }) => {
      await page.goto(`/?lng=${language}`);
      await enterDetailsFromStartToNINO(page, commonContent, language);
    }
  );
});
