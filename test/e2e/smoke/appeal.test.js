const content = require('commonContent');
const urls = require('urls');
const { enterDetailsFromStartToNINO } = require('../page-objects/cya/checkYourAppeal');
const { test } = require('@playwright/test');

const language = 'en';
const commonContent = content[language];
test.describe(`${language.toUpperCase()} - Full Journey @smoke`, () => {
  test(`${language.toUpperCase()} - Appellant full journey from /start-an-appeal to the /check-your-appeal page`, async({ page }) => {
    await page.goto(`${urls.formDownload.benefitAppeal}/?lng=${language}`);
    await enterDetailsFromStartToNINO(page, commonContent, language);
  });
});
