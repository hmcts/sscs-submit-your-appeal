const language = 'cy';
const commonContent = require('commonContent')[language];
const paths = require('paths');

const { test } = require('@playwright/test');
test.describe(`${language.toUpperCase()} - Other Reasons For Appealing`, () => {

  Before(async ({ page }) => {
    await createTheSession(page, language);
    page.goto(paths.reasonsForAppealing.otherReasonForAppealing);
    page.waitForElement('#otherReasonForAppealing');
  });

  After(async ({ page }) => {
    await endTheSession(page);
  });

  test(`${language.toUpperCase()} - When I enter special chars then I see no errors`, ({ page }) => {
    await page.fill('otherReasonForAppealing', '&$%^&%!~$^&&&*');
    await page.click(commonContent.continue);
    page.seeInCurrentUrl(paths.reasonsForAppealing.evidenceProvide);
  });
})