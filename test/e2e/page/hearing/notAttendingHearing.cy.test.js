const language = 'cy';
const commonContent = require('commonContent')[language];
const paths = require('paths');

const { test } = require('@playwright/test');

test.describe(`${language.toUpperCase()} - Not Attending Hearing @batch-08`, () => {
  Before(async({ page }) => {
    await createTheSession(page, language);
    page.goto(paths.hearing.notAttendingHearing);
  });

  After(async({ page }) => {
    await endTheSession(page);
  });

  test(`${language.toUpperCase()} - When I click Continue, I am taken to the check your appeal page`, ({ page }) => {
    continueFromnotAttendingHearing(page, commonContent);
    page.seeInCurrentUrl(paths.checkYourAppeal);
  });
});
