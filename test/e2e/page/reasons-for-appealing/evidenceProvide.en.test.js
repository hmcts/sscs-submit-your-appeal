const language = 'en';
const theHearingContent = require(
  `steps/hearing/the-hearing/content.${language}`
);
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
const { endTheSession } = require('../../page-objects/session/endSession');

test.describe(
  `${language.toUpperCase()} - Evidence provide page @evidence-upload`,
  { tag: '@batch-10' },
  () => {
    if (evidenceUploadEnabled) {
      test.beforeEach('Create session', async({ page }) => {
        await createTheSession(page, language);
        await page.goto(paths.reasonsForAppealing.evidenceProvide);
      });

      test.afterEach('End session', async({ page }) => {
        await endTheSession(page);
      });

      test(`${language.toUpperCase()} - When page select Yes, page am taken to the evidence upload page`, async({
        page
      }) => {
        page.selectAreYouProvidingEvidenceAndContinue(
          language,
          evidenceProvideContent.fields.evidenceProvide.yes
        );
        await page.waitForURL(`**${paths.reasonsForAppealing.evidenceUpload}`);
        await expect(
          page.getByText(evidenceUploadContent.title).first()
        ).toBeVisible();
      });

      test(`${language.toUpperCase()} - When page select No, page am taken to the hearing page`, async({
        page
      }) => {
        page.selectAreYouProvidingEvidenceAndContinue(
          language,
          evidenceProvideContent.fields.evidenceProvide.no
        );
        await page.waitForURL(`**${paths.hearing.theHearing}`);
        await expect(
          page.getByText(theHearingContent.title).first()
        ).toBeVisible();
      });
    }
  }
);
