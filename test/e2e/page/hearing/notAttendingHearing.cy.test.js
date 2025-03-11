const language = 'cy';
const commonContent = require('commonContent')[language];
const paths = require('paths');

const { test } = require('@playwright/test');
const {
  createTheSession
} = require('../../page-objects/session/createSession');
const { endTheSession } = require('../../page-objects/session/endSession');

test.describe(
  `${language.toUpperCase()} - Not Attending Hearing`,
  { tag: '@batch-08' },
  () => {
    test.beforeEach('Create session', async({ page }) => {
      await createTheSession(page, language);
      await page.goto(paths.hearing.notAttendingHearing);
    });

    test.afterEach('End session', async({ page }) => {
      await endTheSession(page);
    });

    test(`${language.toUpperCase()} - When page click Continue, page am taken to the check your appeal page`, async({
      page
    }) => {
      page.continueFromnotAttendingHearing(commonContent);
      await page.waitForURL(`**${paths.checkYourAppeal}`);
    });
  }
);
