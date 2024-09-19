const language = 'en';
const commonContent = require('commonContent')[language];
const theHearingContent = require(`steps/hearing/the-hearing/content.${language}`);
const evidenceDescriptionContent = require(`steps/reasons-for-appealing/evidence-description/content.${language}`);
const paths = require('paths');

const evidenceUploadEnabled = require('config').get('features.evidenceUpload.enabled');

const { test, expect } = require('@playwright/test');
const { createTheSession } = require('../../page-objects/session/createSession');
const { endTheSession } = require('../../page-objects/session/endSession');
const { enterDescription } = require('../../page-objects/upload-evidence/evidenceDescription');

test.describe(`${language.toUpperCase()} - Evidence description page @evidence-upload @batch-10`, () => {
  if (evidenceUploadEnabled) {
    test.beforeEach('Initial navigation', async({ page }) => {
      await createTheSession(page, language);
      await page.goto(paths.reasonsForAppealing.evidenceDescription);
    });

    test.afterEach('Close down', async({ page }) => {
      await endTheSession(page);
    });

    test(`${language.toUpperCase()} - When I select continue, I am taken to the hearing page`, async({ page }) => {
      await page.getByText(commonContent.continue).first().click();
      await page.waitForURL(`**/${paths.hearing.theHearing}`);
      await expect(page.getByText(theHearingContent.title).first()).toBeVisible();
    });

    test(`${language.toUpperCase()} - When I enter special characters and select continue, I see errors`, async({ page }) => {
      await enterDescription(page, 'Description with special characters |');
      await page.waitForURL(`**/${paths.reasonsForAppealing.evidenceDescription}`);
      await expect(page.getByText(evidenceDescriptionContent.title).first()).toBeVisible();
      await expect(page.getByText(evidenceDescriptionContent.fields.describeTheEvidence.error.invalid).first()).toBeVisible();
    });

    test(`${language.toUpperCase()} - When I enter too sort description and select continue, I see errors`, async({ page }) => {
      await enterDescription(page, 'one');
      await page.waitForURL(`**/${paths.reasonsForAppealing.evidenceDescription}`);
      await expect(page.getByText(evidenceDescriptionContent.title).first()).toBeVisible();
      await expect(page.getByText(evidenceDescriptionContent.fields.describeTheEvidence.error.tooShort).first()).toBeVisible();
    });

    test(`${language.toUpperCase()} - I have a csrf token`, async({ page }) => {
      await expect(page.locator('form input[name="_csrf"]').first()).toBeVisible();
    });
  }
});
