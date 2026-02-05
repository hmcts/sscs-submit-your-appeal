const language = 'cy';
const commonContent = require('commonContent')[language];
const haveAMRNContent = require(
  `steps/compliance/have-a-mrn/content.${language}`
);
const paths = require('paths');

const { test, expect } = require('@playwright/test');
const {
  createTheSession
} = require('../../page-objects/session/createSession');
const { endTheSession } = require('../../page-objects/session/endSession');

test.describe(
  `${language.toUpperCase()} - Check MRN`,
  { tag: '@batch-07' },
  () => {
    test.beforeEach('Create session', async ({ page }) => {
      await createTheSession(page, language);
      await page.goto(paths.compliance.haveAMRN);
    });

    test.afterEach('End session', async ({ page }) => {
      await endTheSession(page);
    });

    test(`${language.toUpperCase()} - When page select yes page am taken to the DWP Issuing office page`, async ({
      page
    }) => {
      page.selectHaveYouGotAMRNAndContinue(
        language,
        commonContent,
        '#haveAMRN'
      );
      await page.waitForURL(`**${paths.compliance.dwpIssuingOffice}`);
    });

    test(`${language.toUpperCase()} - When page select no page am taken to the have you contacted DWP page`, async ({
      page
    }) => {
      page.selectHaveYouGotAMRNAndContinue(
        language,
        commonContent,
        '#haveAMRN-2'
      );
      await page.waitForURL(`**${paths.compliance.haveContactedDWP}`);
    });

    test(`${language.toUpperCase()} - When page click continue without selecting an option, page see an error`, async ({
      page
    }) => {
      await page
        .getByRole('button', { name: commonContent.continue })
        .first()
        .click();
      await page.waitForURL(`**${paths.compliance.haveAMRN}`);
      await expect(
        page.getByText(haveAMRNContent.fields.haveAMRN.error.required).first()
      ).toBeVisible();
    });
  }
);
