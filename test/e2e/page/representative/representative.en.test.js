const language = 'en';
const commonContent = require('commonContent')[language];
const paths = require('paths');

const { test, expect } = require('@playwright/test');
const { createTheSession } = require('../../page-objects/session/createSession');
const { endTheSession } = require('../../page-objects/session/endSession');
const { selectDoYouHaveARepresentativeAndContinue } = require('../../page-objects/representative/representative');

test.describe(`${language.toUpperCase()} - Representative @batch-10`, () => {
  test.beforeEach('Initial navigation', async({ page }) => {
    await createTheSession(page, language);
    await page.goto(paths.representative.representative);
  });

  test.afterEach('Close down', async({ page }) => {
    await endTheSession(page);
  });

  test(`${language.toUpperCase()} - When I select yes, I am taken to the representative details page`, async({ page }) => {
    await selectDoYouHaveARepresentativeAndContinue(page, commonContent, '#hasRepresentative-yes');
    await page.waitForURL(`**/${paths.representative.representativeDetails}`);
  });

  test(`${language.toUpperCase()} - When I select No, I am taken to the reason for appealing page`, async({ page }) => {
    await selectDoYouHaveARepresentativeAndContinue(page, commonContent, '#hasRepresentative-no');
    await page.waitForURL(`**/${paths.reasonsForAppealing.reasonForAppealing}`);
  });

  test(`${language.toUpperCase()} - I have a csrf token`, async({ page }) => {
    await expect(page.locator('form input[name="_csrf"]').first()).toBeVisible();
  });
});
