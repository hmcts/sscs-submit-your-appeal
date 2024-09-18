const language = 'en';
const commonContent = require('commonContent')[language];
const haveAMRNContent = require(`steps/compliance/have-a-mrn/content.${language}`);
const paths = require('paths');

const { test } = require('@playwright/test');
test.describe(`${language.toUpperCase()} - Check MRN @batch-07`, () => {
  Before(async ({ page }) => {
    await createTheSession(page, language);
    page.goto(paths.compliance.haveAMRN);
  });

  After(async ({ page }) => {
    await endTheSession(page);
  });

  test(`${language.toUpperCase()} - When I select yes I am taken to the DWP Issuing office page`, ({ page }) => {
    await selectHaveYouGotAMRNAndContinue(page, language, commonContent, '#haveAMRN-yes');
    page.seeInCurrentUrl(paths.compliance.dwpIssuingOffice);
  });

  test(`${language.toUpperCase()} - When I select no I am taken to the have you contacted DWP page`, ({ page }) => {
    await selectHaveYouGotAMRNAndContinue(page, language, commonContent, '#haveAMRN-no');
    page.seeInCurrentUrl(paths.compliance.haveContactedDWP);
  });

  test(`${language.toUpperCase()} - When I click continue without selecting an option, I see an error`, ({ page }) => {
    await page.click(commonContent.continue);
    page.seeInCurrentUrl(paths.compliance.haveAMRN);
    expect(page.getByText(haveAMRNContent.fields.haveAMRN.error.required)).toBeVisible();
  });
});
