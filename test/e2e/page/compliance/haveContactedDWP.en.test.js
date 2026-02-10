const language = 'en';
const commonContent = require('commonContent')[language];
const haveContactedDWPContent = require(
  `steps/compliance/have-contacted-dwp/content.${language}`
);
const paths = require('paths');

const { test, expect } = require('@playwright/test');
const {
  createTheSession
} = require('../../page-objects/session/createSession');
const { endTheSession } = require('../../page-objects/session/endSession');

test.describe(
  `${language.toUpperCase()} - Have Contacted DWP`,
  { tag: '@batch-07' },
  () => {
    test.beforeEach('Create session', async({ page }) => {
      await createTheSession(page, language);
      await page.goto(paths.compliance.haveContactedDWP);
    });

    test.afterEach('End session', async({ page }) => {
      await endTheSession(page);
    });

    test(`${language.toUpperCase()} - When page select yes page am taken to the No MRN page`, async({
      page
    }) => {
      page.selectHaveYouContactedDWPAndContinue(
        language,
        commonContent,
        '#haveContactedDWP'
      );
      await page.waitForURL(`**${paths.compliance.noMRN}`);
    });

    test(`${language.toUpperCase()} - When page select no page am taken to the contact DWP page`, async({
      page
    }) => {
      page.selectHaveYouGotAMRNAndContinue(
        language,
        commonContent,
        '#haveContactedDWP-2'
      );
      await page.waitForURL(`**${paths.compliance.contactDWP}`);
    });

    test(`${language.toUpperCase()} - When page click continue without selecting an option, page see an error`, async({
      page
    }) => {
      await page
        .getByRole('button', { name: commonContent.continue })
        .first()
        .click();
      await page.waitForURL(`**${paths.compliance.haveContactedDWP}`);
      await expect(
        page
          .getByText(
            haveContactedDWPContent.fields.haveContactedDWP.error.required
          )
          .first()
      ).toBeVisible();
    });
  }
);
