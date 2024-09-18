const language = 'en';
const commonContent = require('commonContent')[language];
const paths = require('paths');

const { test } = require('@playwright/test');
const {
  createTheSession
} = require('../../page-objects/session/createSession');
const { endTheSession } = require('../../page-objects/session/endSession');

test.describe(`${language.toUpperCase()} - Other Reasons For Appealing`, () => {
  Before(async({ page }) => {
    await createTheSession(page, language);
    await page.goto(paths.reasonsForAppealing.otherReasonForAppealing);
    await page.locator('#otherReasonForAppealing').first().waitFor();
  });

  After(async({ page }) => {
    await endTheSession(page);
  });

  test(`${language.toUpperCase()} - When I enter special chars then I see no errors`, async({
    page
  }) => {
    await page.fill('otherReasonForAppealing', '&$%^&%!~$^&&&*');
    await page.click(commonContent.continue);
    await page.waitForURL(`**/${paths.reasonsForAppealing.evidenceProvide}`);
  });
});
