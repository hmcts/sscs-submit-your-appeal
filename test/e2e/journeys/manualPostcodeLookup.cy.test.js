

const { test } = require('@playwright/test');

const language = 'cy';
const commonContent = require('commonContent')[language];
const paths = require('paths');
const {
  confirmDetailsArePresent,
  enterDetailsFromNoRepresentativeToEnd,
  enterDetailsFromStartToNINO
} = require('../page-objects/cya/checkYourAppeal');
const { skipPcqCY } = require('../page-objects/pcq/pcq');
const { checkOptionAndContinue } = require('../page-objects/controls/option');
const { enterAppellantContactDetailsManuallyAndContinue } = require('../page-objects/identity/appellantDetails');
const { endTheSession } = require('../page-objects/session/endSession');
const { createTheSession } = require('../page-objects/session/createSession');

test.describe(`${language.toUpperCase()} - Postcode lookup test for type Manual`, { tag: '@functional' }, () => {
  test.beforeEach('Create session and user', async({ page }) => {
    await createTheSession(page, language);
  });

  test.afterEach('End session and delete user', async({ page }) => {
    await endTheSession(page);
  });

  test(`${language.toUpperCase()} - Appellant enters contact details Manually`, async({ page }) => {
    await page.goto(paths.session.root);
    await enterDetailsFromStartToNINO(page, commonContent, language);
    await enterAppellantContactDetailsManuallyAndContinue(page, commonContent);
    await checkOptionAndContinue(page, commonContent, '#doYouWantTextMsgReminders-2');
    await enterDetailsFromNoRepresentativeToEnd(page, language, commonContent);
    await skipPcqCY(page);
    await confirmDetailsArePresent(page, language);
  });
});
