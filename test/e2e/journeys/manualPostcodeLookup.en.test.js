/* eslint-disable no-process-env */

const language = 'en';
const commonContent = require('../../../commonContent')[language];
const paths = require('../../../paths');

const { test } = require('@playwright/test');
const { createTheSession } = require('../page-objects/session/createSession');
const { endTheSession } = require('../page-objects/session/endSession');
const { confirmDetailsArePresent, enterDetailsFromNoRepresentativeToEnd, enterDetailsFromStartToNINO } = require('../page-objects/cya/checkYourAppeal');
const { skipPcq } = require('../page-objects/pcq/pcq');
const { checkOptionAndContinue } = require('../page-objects/controls/option');
const { enterAppellantContactDetailsManuallyAndContinue } = require('../page-objects/identity/appellantDetails');
const { config } = require('config');

/* eslint-disable-next-line no-process-env */
const baseUrl = process.env.TEST_URL || config.get('e2e.frontendUrl');

test.describe(`${language.toUpperCase()} - Postcode lookup test for type Manual`, () => {
  test.beforeEach('Initial navigation', async({ page }) => {
    await createTheSession(page, language);
  });

  test.afterEach('Close down', async({ page }) => {
    await endTheSession(page);
  });

  test(`${language.toUpperCase()} - Appellant enters contact details Manually`, async({ page }) => {
    await page.goto(baseUrl + paths.session.root);
    await enterDetailsFromStartToNINO(page, commonContent, language);
    await enterAppellantContactDetailsManuallyAndContinue(page, commonContent);
    await checkOptionAndContinue(page, commonContent, '#doYouWantTextMsgReminders-no');
    await enterDetailsFromNoRepresentativeToEnd(page, language, commonContent);
    await skipPcq(page);
    await confirmDetailsArePresent(page, language);
  });
});
