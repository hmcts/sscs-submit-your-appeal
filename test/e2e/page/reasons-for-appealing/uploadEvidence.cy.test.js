const language = 'cy';
const evidenceUploadContent = require(
  `steps/reasons-for-appealing/evidence-upload/content.${language}`
);
const evidenceProvideContent = require(
  `steps/reasons-for-appealing/evidence-provide/content.${language}`
);
const paths = require('paths');

const evidenceUploadEnabled = require('config').get(
  'features.evidenceUpload.enabled'
);

const { test, expect } = require('@playwright/test');
const {
  createTheSession
} = require('../../page-objects/session/createSession');
const {
  selectAreYouProvidingEvidenceAndContinue
} = require('../../page-objects/upload-evidence/evidenceProvide');

test.describe(
  `${language.toUpperCase()} - Uploading Evidence @evidence-upload`,
  { tag: '@batch-10' },
  () => {
    if (evidenceUploadEnabled) {
      test.beforeEach('Create session', async ({ page }) => {
        await createTheSession(page, language);
        await page.goto(paths.reasonsForAppealing.evidenceProvide);
        await selectAreYouProvidingEvidenceAndContinue(
          page,
          evidenceProvideContent.fields.evidenceProvide.yes
        );
      });

      test(`${language.toUpperCase()} - page can upload correctly a file`, async ({
        page
      }) => {
        await page.locator('#uploadEv').setInputFiles('evidence.txt');
        await expect(page.locator('.govuk-error-summary')).toBeHidden();
      });

      test(`${language.toUpperCase()} - page cannot upload the wrong type of file`, async ({
        page
      }) => {
        await page.locator('#uploadEv').setInputFiles('evidence.zip');
        await expect(
          page.locator('.govuk-error-summary').first()
        ).toBeVisible();
        await expect(
          page
            .getByText(
              evidenceUploadContent.fields.uploadEv.error.wrongFileType
            )
            .first()
        ).toBeVisible();
      });

      test(`${language.toUpperCase()} - page cannot upload a very large file`, async ({
        page
      }) => {
        await page.locator('#uploadEv').setInputFiles('largefile.txt');
        await expect(
          page.locator('.govuk-error-summary').first()
        ).toBeVisible();
        await expect(
          page
            .getByText(
              evidenceUploadContent.fields.uploadEv.error.maxFileSizeExceeded
            )
            .first()
        ).toBeVisible();
      });

      test(`${language.toUpperCase()} - page cannot upload more than the total amount of bytes`, async ({
        page
      }) => {
        await page.locator('#uploadEv').setInputFiles('largeimage.jpg');
        await page.locator('#uploadEv').setInputFiles('largeimage.jpg');
        await page.locator('#uploadEv').setInputFiles('largeimage.jpg');
        await page.locator('#uploadEv').setInputFiles('largeimage.jpg');
        await expect(
          page.locator('.govuk-error-summary').first()
        ).toBeVisible();
        await expect(
          page
            .getByText(
              evidenceUploadContent.fields.uploadEv.error.totalFileSizeExceeded
            )
            .first()
        ).toBeVisible();
      });

      test(`${language.toUpperCase()} - page see an error if page submit the form without uploading a file`, async ({
        page
      }) => {
        await page.locator('.govuk-button').first().click();
        await expect(
          page.locator('.govuk-error-summary').first()
        ).toBeVisible();
        await expect(
          page.getByText(evidenceUploadContent.noItemsError).first()
        ).toBeVisible();
      });

      test(`${language.toUpperCase()} - SSCS-3768 bug`, async ({ page }) => {
        await page.locator('.govuk-button').first().click();
        await expect(
          page.locator('.govuk-error-summary').first()
        ).toBeVisible();
        await expect(
          page.getByText(evidenceUploadContent.noItemsError).first()
        ).toBeVisible();
        await page.locator('#uploadEv').setInputFiles('evidence.txt');
        await expect(page.locator('.govuk-error-summary')).toBeHidden();
        await page.waitForURL(`**${paths.reasonsForAppealing.evidenceUpload}`);
      });
    }
  }
);
