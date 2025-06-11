const { test, expect } = require('@playwright/test');

const language = 'cy';
const commonContent = require('commonContent')[language];
const haveAMRNContent = require(
  `steps/compliance/have-a-mrn/content.${language}`
);
const reasonForAppealingContent = require(
  `steps/reasons-for-appealing/reason-for-appealing/content.${language}`
);
const independenceContent = require(
  `steps/start/independence/content.${language}`
);
const paths = require('paths');
const {
  enterBenefitTypeAndContinue
} = require('../page-objects/start/benefit-type');
const { endTheSession } = require('../page-objects/session/endSession');
const { createTheSession } = require('../page-objects/session/createSession');

/* eslint-disable global-require */

if (require('config').get('features.allowESA.enabled').toString() === 'true') {
  test.describe(`${language.toUpperCase()} - Appellant who chooses ESA @batch-01 @esa`, () => {
    test.beforeEach('Create session and user', async({ page }) => {
      await createTheSession(page, language);
    });

    test.afterEach('End session and delete user', async({ page }) => {
      await endTheSession(page);
    });

    test(`${language.toUpperCase()} - Sees an appropriate message on haveAMRN`, async({
      page
    }) => {
      await enterBenefitTypeAndContinue(page, language, commonContent, 'ESA');
      // page.chooseLanguagePreference(commonContent, '#languagePreferenceWelsh');
      await page.goto(paths.compliance.haveAMRN);
      await expect(
        page.getByText(haveAMRNContent.esa.subtitle).first()
      ).toBeVisible();
    });

    test(`${language.toUpperCase()} - Sees an appropriate message on reason for appealing`, async({
      page
    }) => {
      await enterBenefitTypeAndContinue(page, language, commonContent, 'ESA');
      // page.chooseLanguagePreference(commonContent, '#languagePreferenceWelsh');
      await page.goto(paths.reasonsForAppealing.reasonForAppealing);
      await expect(
        page.getByText(reasonForAppealingContent.dwpExplained).first()
      ).toBeVisible();
    });

    test(`${language.toUpperCase()} - Sees an appropriate message on independence`, async({
      page
    }) => {
      await enterBenefitTypeAndContinue(page, language, commonContent, 'ESA');
      // page.chooseLanguagePreference(commonContent, '#languagePreferenceWelsh');
      await page.goto(paths.start.independence);
      await expect(
        page.getByText(independenceContent.reviewed).first()
      ).toBeVisible();
    });
    /* eslint-enable global-require */
  });
}
