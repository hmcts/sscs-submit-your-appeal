const language = 'cy';
const evidenceUploadContent = require(`steps/reasons-for-appealing/evidence-upload/content.${language}`);
const evidenceProvideContent = require(`steps/reasons-for-appealing/evidence-provide/content.${language}`);
const paths = require('paths');

const evidenceUploadEnabled = require('config').get('features.evidenceUpload.enabled');

const { test, expect } = require('@playwright/test');
const { createTheSession } = require('../../page-objects/session/createSession');
const { endTheSession } = require('../../page-objects/session/endSession');
const { selectAreYouProvidingEvidenceAndContinue } = require('../../page-objects/upload-evidence/evidenceProvide');

test.describe(`${language.toUpperCase()} - Uploading Evidence @evidence-upload @batch-10`, () => {
  if (evidenceUploadEnabled) {
    test.beforeEach('Initial navigation', async({ page }) => {
      await createTheSession(page, language);
      await page.goto(paths.reasonsForAppealing.evidenceProvide);
      await selectAreYouProvidingEvidenceAndContinue(page, evidenceProvideContent.fields.evidenceProvide.yes);
    });
    test.afterEach('Close down', async({ page }) => {
      await endTheSession(page);
    });
    test(`${language.toUpperCase()} - I can upload correctly a file`, async({ page }) => {
      await page.locator('#uploadEv').setInputFiles('evidence.txt');
      await expect(page.locator('.govuk-error-summary').first()).not.toBeVisible();
    });

    test(`${language.toUpperCase()} - I cannot upload the wrong type of file`, async({ page }) => {
      await page.locator('#uploadEv').setInputFiles('evidence.zip');
      await expect(page.locator('.govuk-error-summary').first()).toBeVisible();
      await expect(page.getByText(evidenceUploadContent.fields.uploadEv.error.wrongFileType).first()).toBeVisible();
    });

    test(`${language.toUpperCase()} - I cannot upload a very large file`, async({ page }) => {
      await page.locator('#uploadEv').setInputFiles('largefile.txt');
      await expect(page.locator('.govuk-error-summary').first()).toBeVisible();
      await expect(page.getByText(evidenceUploadContent.fields.uploadEv.error.maxFileSizeExceeded).first()).toBeVisible();
    });

    test(`${language.toUpperCase()} - I cannot upload more than the total amount of bytes`, async({ page }) => {
      await page.locator('#uploadEv').setInputFiles('largeimage.jpg');
      await page.waitForTimeout(1000);
      await page.locator('#uploadEv').setInputFiles('largeimage.jpg');
      await page.waitForTimeout(1000);
      await page.locator('#uploadEv').setInputFiles('largeimage.jpg');
      await page.waitForTimeout(1000);
      await page.locator('#uploadEv').setInputFiles('largeimage.jpg');
      await expect(page.locator('.govuk-error-summary').first()).toBeVisible();
      await expect(page.getByText(evidenceUploadContent.fields.uploadEv.error.totalFileSizeExceeded).first()).toBeVisible();
    });

    test(`${language.toUpperCase()} - I see an error if I submit the form without uploading a file`, async({ page }) => {
      await page.getByText('.govuk-button').first().click();
      await expect(page.locator('.govuk-error-summary').first()).toBeVisible();
      await expect(page.getByText(evidenceUploadContent.noItemsError).first()).toBeVisible();
    });

    test(`${language.toUpperCase()} - SSCS-3768 bug`, async({ page }) => {
      await page.getByText('.govuk-button').first().click();
      await expect(page.locator('.govuk-error-summary').first()).toBeVisible();
      await expect(page.getByText(evidenceUploadContent.noItemsError).first()).toBeVisible();
      await page.locator('#uploadEv').setInputFiles('evidence.txt');
      await expect(page.locator('.govuk-error-summary').first()).not.toBeVisible();
      await page.waitForURL(`**/${paths.reasonsForAppealing.evidenceUpload}`);
    });
  }
});
