const language = 'cy';
const commonContent = require('commonContent')[language];
const theHearingContent = require(`steps/hearing/the-hearing/content.${language}`);
const evidenceDescriptionContent = require(`steps/reasons-for-appealing/evidence-description/content.${language}`);
const paths = require('paths');

const evidenceUploadEnabled = require('config').get('features.evidenceUpload.enabled');

const { test } = require('@playwright/test');
test.describe(`${language.toUpperCase()} - Evidence description page @evidence-upload @batch-10`, () => {

  if (evidenceUploadEnabled) {
    Before(async ({ page }) => {
      await createTheSession(page, language);
      page.goto(paths.reasonsForAppealing.evidenceDescription);
    });

    After(async ({ page }) => {
      await endTheSession(page);
    });

    test(`${language.toUpperCase()} - When I select continue, I am taken to the hearing page`, ({ page }) => {
      await page.click(commonContent.continue);
      page.seeInCurrentUrl(paths.hearing.theHearing);
      expect(page.getByText(theHearingContent.title)).toBeVisible();
    });

    test(`${language.toUpperCase()} - When I enter special characters and select continue, I see errors`, ({ page }) => {
      enterDescription(page, 'Description with special characters |');
      page.seeInCurrentUrl(paths.reasonsForAppealing.evidenceDescription);
      expect(page.getByText(evidenceDescriptionContent.title)).toBeVisible();
      expect(page.getByText(evidenceDescriptionContent.fields.describeTheEvidence.error.invalid)).toBeVisible();
    });

    test(`${language.toUpperCase()} - When I enter too sort description and select continue, I see errors`, ({ page }) => {
      enterDescription(page, 'one');
      page.seeInCurrentUrl(paths.reasonsForAppealing.evidenceDescription);
      expect(page.getByText(evidenceDescriptionContent.title)).toBeVisible();
      expect(page.getByText(evidenceDescriptionContent.fields.describeTheEvidence.error.tooShort)).toBeVisible();
    });

    test(`${language.toUpperCase()} - I have a csrf token`, ({ page }) => {
      page.seeElementInDOM('form input[name="_csrf"]');
    });
  }
})