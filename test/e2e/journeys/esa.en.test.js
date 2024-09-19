const language = 'en';
const commonContent = require('../../../commonContent')[language];
const haveAMRNContent = require(`../../../steps/compliance/have-a-mrn/content.${language}`);
const reasonForAppealingContent = require(`../../../steps/reasons-for-appealing/reason-for-appealing/content.${language}`);
const independenceContent = require(`../../../steps/start/independence/content.${language}`);
const paths = require('../../../paths');
const { enterBenefitTypeAndContinue } = require('../page-objects/start/benefit-type');
const { config } = require('config');

/* eslint-disable-next-line no-process-env */
const baseUrl = process.env.TEST_URL || config.get('e2e.frontendUrl');

/* eslint-disable global-require */
/* eslint-disable max-len */
if (require('config').get('features.allowESA.enabled') === 'true') {
  const { test, expect } = require('@playwright/test');
  const { createTheSession } = require('../page-objects/session/createSession');
  const { endTheSession } = require('../page-objects/session/endSession');

  test.describe(`${language.toUpperCase()} - Appellant who chooses ESA @batch-01 @esa`, () => {
    test.beforeEach('Initial navigation', async({ page }) => {
      await createTheSession(page, language);
    });

    test.afterEach('Close down', async({ page }) => {
      await endTheSession(page);
    });

    test(`${language.toUpperCase()} - Sees an appropriate message on haveAMRN`, async({ page }) => {
      await enterBenefitTypeAndContinue(page, language, commonContent, 'ESA');
      // await chooseLanguagePreference(page, commonContent, 'no');
      await page.goto(baseUrl + paths.compliance.haveAMRN);
      await expect(page.getByText(haveAMRNContent.esa.subtitle).first()).toBeVisible();
    });

    test(`${language.toUpperCase()} - Sees an appropriate message on reason for appealing`, async({ page }) => {
      await enterBenefitTypeAndContinue(page, language, commonContent, 'ESA');
      // await chooseLanguagePreference(page, commonContent, 'no');
      await page.goto(baseUrl + paths.reasonsForAppealing.reasonForAppealing);
      await expect(page.getByText(reasonForAppealingContent.dwpExplained).first()).toBeVisible();
    });

    test(`${language.toUpperCase()} - Sees an appropriate message on independence`, async({ page }) => {
      await enterBenefitTypeAndContinue(page, language, commonContent, 'ESA');
      // await chooseLanguagePreference(page, commonContent, 'no');
      await page.goto(baseUrl + paths.start.independence);
      await expect(page.getByText(independenceContent.reviewed).first()).toBeVisible();
    });
  });
  /* eslint-enable global-require */
}
