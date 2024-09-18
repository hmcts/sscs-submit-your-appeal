const language = 'en';
const theHearingContent = require(`steps/hearing/the-hearing/content.${language}`);
const evidenceUploadContent = require(`steps/reasons-for-appealing/evidence-upload/content.${language}`);
const evidenceProvideContent = require(`steps/reasons-for-appealing/evidence-provide/content.${language}`);
const paths = require('paths');

const evidenceUploadEnabled = require('config').get('features.evidenceUpload.enabled');

const { test } = require('@playwright/test');

test.describe(`${language.toUpperCase()} - Evidence provide page @evidence-upload @batch-10`, () => {
  if (evidenceUploadEnabled) {
    Before(async({ page }) => {
      await createTheSession(page, language);
      page.goto(paths.reasonsForAppealing.evidenceProvide);
    });

    After(async({ page }) => {
      await endTheSession(page);
    });

    test(`${language.toUpperCase()} - When I select Yes, I am taken to the evidence upload page`, ({ page }) => {
      selectAreYouProvidingEvidenceAndContinue(page, language, evidenceProvideContent.fields.evidenceProvide.yes);
      page.seeInCurrentUrl(paths.reasonsForAppealing.evidenceUpload);
      expect(page.getByText(evidenceUploadContent.title)).toBeVisible();
    });

    test(`${language.toUpperCase()} - When I select No, I am taken to the hearing page`, ({ page }) => {
      selectAreYouProvidingEvidenceAndContinue(page, language, evidenceProvideContent.fields.evidenceProvide.no);
      page.seeInCurrentUrl(paths.hearing.theHearing);
      expect(page.getByText(theHearingContent.title)).toBeVisible();
    });
  }
});
