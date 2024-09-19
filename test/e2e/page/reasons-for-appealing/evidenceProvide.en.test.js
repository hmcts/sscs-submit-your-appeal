/* eslint-disable no-useless-escape */
const language = 'en';
const theHearingContent = require(`../../../../steps/hearing/the-hearing/content.${language}`);
const evidenceUploadContent = require(`../../../../steps/reasons-for-appealing/evidence-upload/content.${language}`);
const evidenceProvideContent = require(`../../../../steps/reasons-for-appealing/evidence-provide/content.${language}`);
const paths = require('../../../../paths');

const evidenceUploadEnabled = require('config').get('features.evidenceUpload.enabled');

const { test, expect } = require('@playwright/test');
const { createTheSession } = require('../../page-objects/session/createSession');
const { endTheSession } = require('../../page-objects/session/endSession');
const { selectAreYouProvidingEvidenceAndContinue } = require('../../page-objects/upload-evidence/evidenceProvide');
const { config } = require('config');

/* eslint-disable-next-line no-process-env */
const baseUrl = process.env.TEST_URL || config.get('e2e.frontendUrl');

test.describe(`${language.toUpperCase()} - Evidence provide page @evidence-upload @batch-10`, () => {
  if (evidenceUploadEnabled) {
    test.beforeEach('Initial navigation', async({ page }) => {
      await createTheSession(page, language);
      await page.goto(baseUrl + paths.reasonsForAppealing.evidenceProvide);
    });

    test.afterEach('Close down', async({ page }) => {
      await endTheSession(page);
    });

    test(`${language.toUpperCase()} - When I select Yes, I am taken to the evidence upload page`, async({ page }) => {
      await selectAreYouProvidingEvidenceAndContinue(page, language, evidenceProvideContent.fields.evidenceProvide.yes);
      await page.waitForURL(`**\/${paths.reasonsForAppealing.evidenceUpload}`);
      await expect(page.getByText(evidenceUploadContent.title).first()).toBeVisible();
    });

    test(`${language.toUpperCase()} - When I select No, I am taken to the hearing page`, async({ page }) => {
      await selectAreYouProvidingEvidenceAndContinue(page, language, evidenceProvideContent.fields.evidenceProvide.no);
      await page.waitForURL(`**\/${paths.hearing.theHearing}`);
      await expect(page.getByText(theHearingContent.title).first()).toBeVisible();
    });
  }
});
