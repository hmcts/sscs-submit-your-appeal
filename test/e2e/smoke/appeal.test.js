const content = require('commonContent');
const urls = require('urls');
const checkYourAppeal = require('../page-objects/cya/checkYourAppeal.js');

const language = 'en';
const commonContent = content[language];

const { test } = require('@playwright/test');

test.describe(`${language.toUpperCase()} - Full Journey @smoke`, () => {
  test(`${language.toUpperCase()} - Appellant full journey from /start-an-appeal to the /check-your-appeal page @smoke`, async({
    page
  }) => {
    await page.goto(`${urls.formDownload.benefitAppeal}/?lng=${language}`);
    await page.waitForTimeout(1000);
    await checkYourAppeal.enterDetailsFromStartToNINO(
      page,
      commonContent,
      language
    );
  });
});
