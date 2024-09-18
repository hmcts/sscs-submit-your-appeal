const language = 'cy';
const commonContent = require('commonContent')[language];
const sendingEvidenceContent = require(`steps/reasons-for-appealing/sending-evidence/content.${language}`);
const paths = require('paths');

const evidenceUploadEnabled = require('config').get('features.evidenceUpload.enabled');

const { test } = require('@playwright/test');
test.describe(`${language.toUpperCase()} - Sending Evidence - appellant contact details @evidence-upload @batch-10`, () => {

  if (!evidenceUploadEnabled) {
    Before(async ({ page }) => {
      await createTheSession(page, language);
      page.goto(paths.identity.enterAppellantContactDetails);
    });

    After(async ({ page }) => {
      await endTheSession(page);
    });

    test(`${language.toUpperCase()} - When I omit my email address I see the correct content on /sending-evidence`, ({
                                                                                                                       page,
                                                                                                                     }) => {
      enterAppellantContactDetailsAndContinue(page, commonContent, language);
      page.goto(paths.reasonsForAppealing.sendingEvidence);
      expect(page.getByText(sendingEvidenceContent.postEvidence)).toBeVisible();
    });

    test(`${language.toUpperCase()} - When I add my email address I should see the correct content on /sending-evidence`, ({
                                                                                                                             page,
                                                                                                                           }) => {
      enterAppellantContactDetailsWithEmailAndContinue(page, );
      page.goto(paths.reasonsForAppealing.sendingEvidence);
      expect(page.getByText(sendingEvidenceContent.postEvidenceWithEmail)).toBeVisible();
    });

    test(`${language.toUpperCase()} - When I go to the /sending-evidence page I see the title`, ({ page }) => {
      enterAppellantContactDetailsAndContinue(page, commonContent, language);
      page.goto(paths.reasonsForAppealing.sendingEvidence);
      expect(page.getByText(sendingEvidenceContent.title)).toBeVisible();
    });

    test(`${language.toUpperCase()} - When clicking continue I see the correct path`, ({ page }) => {
      enterAppellantContactDetailsAndContinue(page, commonContent, language);
      page.goto(paths.reasonsForAppealing.sendingEvidence);
      await page.click(commonContent.continue);
      page.seeInCurrentUrl(paths.hearing.theHearing);
    });
  }
})
