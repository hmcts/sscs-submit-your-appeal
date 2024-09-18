const language = 'cy';
const commonContent = require('commonContent')[language];
const haveContactedDWPContent = require(`steps/compliance/have-contacted-dwp/content.${language}`);
const paths = require('paths');

const { test } = require('@playwright/test');
test.describe(`${language.toUpperCase()} - Have Contacted DWP @batch-07`, () => {
  Before(async ({ page }) => {
    await createTheSession(page, language);
    page.goto(paths.compliance.haveContactedDWP);
  });

  After(async ({ page }) => {
    await endTheSession(page);
  });

  test(`${language.toUpperCase()} - When I select yes I am taken to the No MRN page`, ({ page }) => {
    selectHaveYouContactedDWPAndContinue(page, language, commonContent, '#haveContactedDWP-yes');
    page.seeInCurrentUrl(paths.compliance.noMRN);
  });

  test(`${language.toUpperCase()} - When I select no I am taken to the contact DWP page`, ({ page }) => {
    await selectHaveYouGotAMRNAndContinue(page, language, commonContent, '#haveContactedDWP-no');
    page.seeInCurrentUrl(paths.compliance.contactDWP);
  });

  test(`${language.toUpperCase()} - When I click continue without selecting an option, I see an error`, ({ page }) => {
    await page.click(commonContent.continue);
    page.seeInCurrentUrl(paths.compliance.haveContactedDWP);
    expect(page.getByText(haveContactedDWPContent.fields.haveContactedDWP.error.required)).toBeVisible();
  });
});
