const language = 'en';
const evidenceUploadContent = require(`steps/reasons-for-appealing/evidence-upload/content.${language}`);
const evidenceProvideContent = require(`steps/reasons-for-appealing/evidence-provide/content.${language}`);
const paths = require('paths');

const evidenceUploadEnabled = require('config').get('features.evidenceUpload.enabled');

const { test } = require('@playwright/test');
test.describe(`${language.toUpperCase()} - Uploading Evidence @evidence-upload @batch-10`, () => {

  if (evidenceUploadEnabled) {
    Before(async ({ page }) => {
      await createTheSession(page, language);
      page.goto(paths.reasonsForAppealing.evidenceProvide);
      selectAreYouProvidingEvidenceAndContinue(page, evidenceProvideContent.fields.evidenceProvide.yes);
    });

    test(`${language.toUpperCase()} - I can upload correctly a file`, ({ page }) => {
      attachFile(page, '#uploadEv', 'evidence.txt');
      page.dontSeeElement('.govuk-error-summary');
    });

    test(`${language.toUpperCase()} - I cannot upload the wrong type of file`, ({ page }) => {
      attachFile(page, '#uploadEv', 'evidence.zip');
      page.seeElement('.govuk-error-summary');
      expect(page.getByText(evidenceUploadContent.fields.uploadEv.error.wrongFileType)).toBeVisible();
    });

    test(`${language.toUpperCase()} - I cannot upload a very large file`, ({ page }) => {
      attachFile(page, '#uploadEv', 'largefile.txt');
      page.seeElement('.govuk-error-summary');
      expect(page.getByText(evidenceUploadContent.fields.uploadEv.error.maxFileSizeExceeded)).toBeVisible();
    });

    test(`${language.toUpperCase()} - I cannot upload more than the total amount of bytes`, ({ page }) => {
      attachFile(page, '#uploadEv', 'largeimage.jpg');
      await page.waitForTimeout(1);
      attachFile(page, '#uploadEv', 'largeimage.jpg');
      await page.waitForTimeout(1);
      attachFile(page, '#uploadEv', 'largeimage.jpg');
      await page.waitForTimeout(1);
      attachFile(page, '#uploadEv', 'largeimage.jpg');
      page.seeElement('.govuk-error-summary');
      expect(page.getByText(evidenceUploadContent.fields.uploadEv.error.totalFileSizeExceeded)).toBeVisible();
    });

    test(`${language.toUpperCase()} - I see an error if I submit the form without uploading a file`, ({ page }) => {
      await page.click('.govuk-button');
      page.seeElement('.govuk-error-summary');
      expect(page.getByText(evidenceUploadContent.noItemsError)).toBeVisible();
    });

    test(`${language.toUpperCase()} - SSCS-3768 bug`, ({ page }) => {
      await page.click('.govuk-button');
      page.seeElement('.govuk-error-summary');
      expect(page.getByText(evidenceUploadContent.noItemsError)).toBeVisible();
      attachFile(page, '#uploadEv', 'evidence.txt');
      page.dontSeeElement('.govuk-error-summary');
      page.seeInCurrentUrl(paths.reasonsForAppealing.evidenceUpload);
    });
  }
})