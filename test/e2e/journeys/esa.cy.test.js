const language = 'cy';
const commonContent = require('commonContent')[language];
const haveAMRNContent = require(`steps/compliance/have-a-mrn/content.${language}`);
const reasonForAppealingContent = require(`steps/reasons-for-appealing/reason-for-appealing/content.${language}`);
const independenceContent = require(`steps/start/independence/content.${language}`);
const paths = require('paths');
const { enterBenefitTypeAndContinue } = require('../page-objects/start/benefit-type');

/* eslint-disable global-require */
/* eslint-disable max-len */
if (require('config').get('features.allowESA.enabled') === 'true') {
  const { test, expect } = require('@playwright/test');
  const { createTheSession } = require('../page-objects/session/createSession');
  const { endTheSession } = require('../page-objects/session/endSession');

  test.describe(`${language.toUpperCase()} - Appellant who chooses ESA @batch-01 @esa`, () => {
    Before(async({ page }) => {
      await createTheSession(page, language);
    });

    After(async({ page }) => {
      await endTheSession(page);
    });

    test(`${language.toUpperCase()} - Sees an appropriate message on haveAMRN`, async({ page }) => {
      await enterBenefitTypeAndContinue(page, language, commonContent, 'ESA');
      // await chooseLanguagePreference(page, commonContent, 'no');
      await page.goto(paths.compliance.haveAMRN);
      await expect(page.getByText(haveAMRNContent.esa.subtitle)).toBeVisible();
    });

    test(`${language.toUpperCase()} - Sees an appropriate message on reason for appealing`, async({ page }) => {
      await enterBenefitTypeAndContinue(page, language, commonContent, 'ESA');
      // await chooseLanguagePreference(page, commonContent, 'no');
      await page.goto(paths.reasonsForAppealing.reasonForAppealing);
      await expect(page.getByText(reasonForAppealingContent.dwpExplained)).toBeVisible();
    });

    test(`${language.toUpperCase()} - Sees an appropriate message on independence`, async({ page }) => {
      await enterBenefitTypeAndContinue(page, language, commonContent, 'ESA');
      // await chooseLanguagePreference(page, commonContent, 'no');
      await page.goto(paths.start.independence);
      await expect(page.getByText(independenceContent.reviewed)).toBeVisible();
    });
  });
  /* eslint-enable global-require */
}
