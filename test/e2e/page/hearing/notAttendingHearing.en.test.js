const language = 'en';
const commonContent = require('commonContent')[language];
const paths = require('paths');

const { test } = require('@playwright/test');
const {
  createTheSession
} = require('../../page-objects/session/createSession');
const { endTheSession } = require('../../page-objects/session/endSession');
const {
  continueFromnotAttendingHearing
} = require('../../page-objects/hearing/notAttendingHearing');

test.describe(`${language.toUpperCase()} - Not Attending Hearing @batch-08`, () => {
  Before(async({ page }) => {
    await createTheSession(page, language);
    await page.goto(paths.hearing.notAttendingHearing);
  });

  After(async({ page }) => {
    await endTheSession(page);
  });

  test(`${language.toUpperCase()} - When I click Continue, I am taken to the check your appeal page`, async({
    page
  }) => {
    await continueFromnotAttendingHearing(page, commonContent);
    await page.waitForURL(`**/${paths.checkYourAppeal}`);
  });
});
