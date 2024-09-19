/* eslint-disable no-useless-escape */
const language = 'en';
const commonContent = require('../../../../commonContent')[language];
const sendingEvidenceContent = require(`../../../../steps/reasons-for-appealing/sending-evidence/content.${language}`);
const paths = require('../../../../paths');

const evidenceUploadEnabled = require('config').get('features.evidenceUpload.enabled');

const { test, expect } = require('@playwright/test');
const { createTheSession } = require('../../page-objects/session/createSession');
const { endTheSession } = require('../../page-objects/session/endSession');
const { enterAppellantContactDetailsWithEmailAndContinue, enterAppellantContactDetailsAndContinue } = require('../../page-objects/identity/appellantDetails');
const { config } = require('config');

/* eslint-disable-next-line no-process-env */
const baseUrl = process.env.TEST_URL || config.get('e2e.frontendUrl');

test.describe(`${language.toUpperCase()} - Sending Evidence - appellant contact details @evidence-upload @batch-10`, () => {
  if (!evidenceUploadEnabled) {
    test.beforeEach('Initial navigation', async({ page }) => {
      await createTheSession(page, language);
      await page.goto(baseUrl + paths.identity.enterAppellantContactDetails);
    });

    test.afterEach('Close down', async({ page }) => {
      await endTheSession(page);
    });

    test(`${language.toUpperCase()} - When I omit my email address I see the correct content on /sending-evidence`, async({ page }) => {
      await enterAppellantContactDetailsAndContinue(page, commonContent, language);
      await page.goto(baseUrl + paths.reasonsForAppealing.sendingEvidence);
      await expect(page.getByText(sendingEvidenceContent.postEvidence).first()).toBeVisible();
    });

    test(`${language.toUpperCase()} - When I add my email address I should see the correct content on /sending-evidence`, async({ page }) => {
      await enterAppellantContactDetailsWithEmailAndContinue(page);
      await page.goto(baseUrl + paths.reasonsForAppealing.sendingEvidence);
      await expect(page.getByText(sendingEvidenceContent.postEvidenceWithEmail).first()).toBeVisible();
    });

    test(`${language.toUpperCase()} - When I go to the /sending-evidence page I see the title`, async({ page }) => {
      await enterAppellantContactDetailsAndContinue(page, commonContent, language);
      await page.goto(baseUrl + paths.reasonsForAppealing.sendingEvidence);
      await expect(page.getByText(sendingEvidenceContent.title).first()).toBeVisible();
    });

    test(`${language.toUpperCase()} - When clicking continue I see the correct path`, async({ page }) => {
      await enterAppellantContactDetailsAndContinue(page, commonContent, language);
      await page.goto(baseUrl + paths.reasonsForAppealing.sendingEvidence);
      await page.getByText(commonContent.continue).first().click();
      await page.waitForURL(`**\/${paths.hearing.theHearing}`);
    });
  }
});
