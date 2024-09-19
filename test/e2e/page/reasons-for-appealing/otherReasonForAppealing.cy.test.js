const language = 'cy';
const commonContent = require('commonContent')[language];
const paths = require('paths');

const { test } = require('@playwright/test');
const { createTheSession } = require('../../page-objects/session/createSession');
const { endTheSession } = require('../../page-objects/session/endSession');

test.describe(`${language.toUpperCase()} - Other Reasons For Appealing`, () => {
  test.beforeEach('Initial navigation', async({ page }) => {
    await createTheSession(page, language);
    await page.goto(paths.reasonsForAppealing.otherReasonForAppealing);
    await page.locator('#otherReasonForAppealing').first().waitFor();
  });

  test.afterEach('Close down', async({ page }) => {
    await endTheSession(page);
  });

  test(`${language.toUpperCase()} - When I enter special chars then I see no errors`, async({ page }) => {
    await page.fill('otherReasonForAppealing', '&$%^&%!~$^&&&*');
    await page.getByText(commonContent.continue).first().click();
    await page.waitForURL(`**/${paths.reasonsForAppealing.evidenceProvide}`);
  });
});
