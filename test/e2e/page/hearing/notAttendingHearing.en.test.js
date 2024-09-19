const language = 'en';
const commonContent = require('../../../../commonContent')[language];
const paths = require('../../../../paths');

const { test } = require('@playwright/test');
const { createTheSession } = require('../../page-objects/session/createSession');
const { endTheSession } = require('../../page-objects/session/endSession');
const { continueFromnotAttendingHearing } = require('../../page-objects/hearing/notAttendingHearing');
const { config } = require('config');

/* eslint-disable-next-line no-process-env */
const baseUrl = process.env.TEST_URL || config.get('e2e.frontendUrl');

test.describe(`${language.toUpperCase()} - Not Attending Hearing @batch-08`, () => {
  test.beforeEach('Initial navigation', async({ page }) => {
    await createTheSession(page, language);
    await page.goto(baseUrl + paths.hearing.notAttendingHearing);
  });

  test.afterEach('Close down', async({ page }) => {
    await endTheSession(page);
  });

  test(`${language.toUpperCase()} - When I click Continue, I am taken to the check your appeal page`, async({ page }) => {
    await continueFromnotAttendingHearing(page, commonContent);
    await page.waitForURL(`**/${paths.checkYourAppeal}`);
  });
});
