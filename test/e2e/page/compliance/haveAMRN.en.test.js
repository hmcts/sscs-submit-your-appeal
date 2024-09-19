/* eslint-disable no-useless-escape */
const language = 'en';
const commonContent = require('../../../../commonContent')[language];
const haveAMRNContent = require(`../../../../steps/compliance/have-a-mrn/content.${language}`);
const paths = require('../../../../paths');

const { test, expect } = require('@playwright/test');
const { createTheSession } = require('../../page-objects/session/createSession');
const { endTheSession } = require('../../page-objects/session/endSession');
const { selectHaveYouGotAMRNAndContinue } = require('../../page-objects/compliance/haveAMRN');
const { config } = require('config');

/* eslint-disable-next-line no-process-env */
const baseUrl = process.env.TEST_URL || config.get('e2e.frontendUrl');

test.describe(`${language.toUpperCase()} - Check MRN @batch-07`, () => {
  test.beforeEach('Initial navigation', async({ page }) => {
    await createTheSession(page, language);
    await page.goto(baseUrl + paths.compliance.haveAMRN);
  });

  test.afterEach('Close down', async({ page }) => {
    await endTheSession(page);
  });

  test(`${language.toUpperCase()} - When I select yes I am taken to the DWP Issuing office page`, async({ page }) => {
    await selectHaveYouGotAMRNAndContinue(page, language, commonContent, '#haveAMRN-yes');
    await page.waitForURL(`**\/${paths.compliance.dwpIssuingOffice}`);
  });

  test(`${language.toUpperCase()} - When I select no I am taken to the have you contacted DWP page`, async({ page }) => {
    await selectHaveYouGotAMRNAndContinue(page, language, commonContent, '#haveAMRN-no');
    await page.waitForURL(`**\/${paths.compliance.haveContactedDWP}`);
  });

  test(`${language.toUpperCase()} - When I click continue without selecting an option, I see an error`, async({ page }) => {
    await page.getByText(commonContent.continue).first().click();
    await page.waitForURL(`**\/${paths.compliance.haveAMRN}`);
    await expect(page.getByText(haveAMRNContent.fields.haveAMRN.error.required).first()).toBeVisible();
  });
});
