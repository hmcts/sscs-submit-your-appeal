const language = 'en';
const commonContent = require('commonContent')[language];
const sendingEvidenceContent = require(
  `steps/reasons-for-appealing/sending-evidence/content.${language}`
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
const {
  enterAppellantContactDetailsAndContinue,
  enterAppellantContactDetailsWithEmailAndContinue
} = require('../../page-objects/identity/appellantDetails');

test.describe(
  `${language.toUpperCase()} - Sending Evidence - appellant contact details @evidence-upload`,
  { tag: '@batch-10' },
  () => {
    if (!evidenceUploadEnabled) {
      test.beforeEach('Create session', async({ page }) => {
        await createTheSession(page, language);
        await page.goto(paths.identity.enterAppellantContactDetails);
      });

      test.afterEach('End session', async({ page }) => {
        await endTheSession(page);
      });

      test(`${language.toUpperCase()} - When page omit my email address page see the correct content on /sending-evidence`, async({
        page
      }) => {
        await enterAppellantContactDetailsAndContinue(
          page,
          commonContent,
          language
        );
        await page.goto(paths.reasonsForAppealing.sendingEvidence);
        await expect(
          page.getByText(sendingEvidenceContent.postEvidence).first()
        ).toBeVisible();
      });

      test(`${language.toUpperCase()} - When page add my email address page should see the correct content on /sending-evidence`, async({
        page
      }) => {
        await enterAppellantContactDetailsWithEmailAndContinue(page);
        await page.goto(paths.reasonsForAppealing.sendingEvidence);
        await expect(
          page.getByText(sendingEvidenceContent.postEvidenceWithEmail).first()
        ).toBeVisible();
      });

      test(`${language.toUpperCase()} - When page go to the /sending-evidence page page see the title`, async({
        page
      }) => {
        await enterAppellantContactDetailsAndContinue(
          page,
          commonContent,
          language
        );
        await page.goto(paths.reasonsForAppealing.sendingEvidence);
        await expect(
          page.getByText(sendingEvidenceContent.title).first()
        ).toBeVisible();
      });

      test(`${language.toUpperCase()} - When clicking continue page see the correct path`, async({
        page
      }) => {
        await enterAppellantContactDetailsAndContinue(
          page,
          commonContent,
          language
        );
        await page.goto(paths.reasonsForAppealing.sendingEvidence);
        await page
          .getByRole('button', { name: commonContent.continue })
          .first()
          .click();
        await page.waitForURL(`**${paths.hearing.theHearing}`);
      });
    }
  }
);
