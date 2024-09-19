/* eslint-disable no-useless-escape */
const language = 'en';
const commonContent = require('../../../../commonContent')[language];
const haveContactedDWPContent = require(`../../../../steps/compliance/have-contacted-dwp/content.${language}`);
const paths = require('../../../../paths');

const { test, expect } = require('@playwright/test');
const { createTheSession } = require('../../page-objects/session/createSession');
const { endTheSession } = require('../../page-objects/session/endSession');
const { selectHaveYouContactedDWPAndContinue } = require('../../page-objects/compliance/haveContactedDWP');
const { selectHaveYouGotAMRNAndContinue } = require('../../page-objects/compliance/haveAMRN');
const { config } = require('config');

/* eslint-disable-next-line no-process-env */
const baseUrl = process.env.TEST_URL || config.get('e2e.frontendUrl');

test.describe(`${language.toUpperCase()} - Have Contacted DWP @batch-07`, () => {
  test.beforeEach('Initial navigation', async({ page }) => {
    await createTheSession(page, language);
    await page.goto(baseUrl + paths.compliance.haveContactedDWP);
  });

  test.afterEach('Close down', async({ page }) => {
    await endTheSession(page);
  });

  test(`${language.toUpperCase()} - When I select yes I am taken to the No MRN page`, async({ page }) => {
    await selectHaveYouContactedDWPAndContinue(page, language, commonContent, '#haveContactedDWP-yes');
    await page.waitForURL(`**\/${paths.compliance.noMRN}`);
  });

  test(`${language.toUpperCase()} - When I select no I am taken to the contact DWP page`, async({ page }) => {
    await selectHaveYouGotAMRNAndContinue(page, language, commonContent, '#haveContactedDWP-no');
    await page.waitForURL(`**\/${paths.compliance.contactDWP}`);
  });

  test(`${language.toUpperCase()} - When I click continue without selecting an option, I see an error`, async({ page }) => {
    await page.getByText(commonContent.continue).first().click();
    await page.waitForURL(`**\/${paths.compliance.haveContactedDWP}`);
    await expect(page.getByText(haveContactedDWPContent.fields.haveContactedDWP.error.required).first()).toBeVisible();
  });
});
