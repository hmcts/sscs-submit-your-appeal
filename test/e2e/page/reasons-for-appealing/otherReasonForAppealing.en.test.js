const language = 'en';
const commonContent = require('commonContent')[language];
const paths = require('paths');

const { test } = require('@playwright/test');
const {
  createTheSession
} = require('../../page-objects/session/createSession');
const { endTheSession } = require('../../page-objects/session/endSession');

test.describe(`${language.toUpperCase()} - Other Reasons For Appealing`, () => {
  test.beforeEach('Create session', async({ page }) => {
    await createTheSession(page, language);
    await page.goto(paths.reasonsForAppealing.otherReasonForAppealing);
    page.waitForElement('#otherReasonForAppealing');
  });

  test.afterEach('End session', async({ page }) => {
    await endTheSession(page);
  });

  test(`${language.toUpperCase()} - When page enter special chars then page see no errors`, async({
    page
  }) => {
    await page
      .locator('#otherReasonForAppealing')
      .first()
      .fill('&$%^&%!~$^&&&*');
    await page
      .getByRole('button', { name: commonContent.continue })
      .first()
      .click();
    await page.waitForURL(`**${paths.reasonsForAppealing.evidenceProvide}`);
  });
});
