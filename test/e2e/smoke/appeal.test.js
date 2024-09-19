const content = require('../../../commonContent');
const checkYourAppeal = require('../page-objects/cya/checkYourAppeal.js');

const language = 'en';
const commonContent = content[language];

const { test } = require('@playwright/test');
const {config} = require("config");
/* eslint-disable-next-line no-process-env */
const baseUrl = process.env.TEST_URL || config.get('e2e.frontendUrl');
test.describe(`${language.toUpperCase()} - Full Journey @smoke`, () => {
  test(`${language.toUpperCase()} - Appellant full journey from /start-an-appeal to the /check-your-appeal page @smoke`, async({
    page
  }) => {
    await page.goto(`${baseUrl}/?lng=${language}`);
    await page.waitForTimeout(1000);
    await checkYourAppeal.enterDetailsFromStartToNINO(
      page,
      commonContent,
      language
    );
  });
});
