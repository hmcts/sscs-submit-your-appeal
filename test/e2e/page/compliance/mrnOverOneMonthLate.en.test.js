const language = 'en';
const commonContent = require('commonContent')[language];
const mrnOverAMonthLateContent = require(
  `steps/compliance/mrn-over-month-late/content.${language}`
);
const paths = require('paths');

const { test, expect } = require('@playwright/test');
const {
  createTheSession
} = require('../../page-objects/session/createSession');
const { endTheSession } = require('../../page-objects/session/endSession');

test.describe(
  `${language.toUpperCase()} - MRN Over one month late`,
  { tag: '@batch-07' },
  () => {
    test.beforeEach('Create session', async({ page }) => {
      await createTheSession(page, language);
      await page.goto(paths.compliance.mrnOverMonthLate);
    });

    test.afterEach('End session', async({ page }) => {
      await endTheSession(page);
    });

    test(`${language.toUpperCase()} - page enter a lateness reason, page click continue, page am taken to /enter-appellant-name`, async({
      page
    }) => {
      await page.locator('#reasonForBeingLate').fill('Reason for being late');
      await page
        .getByRole('button', { name: commonContent.continue })
        .first()
        .click();
      await page.waitForURL(`**${paths.identity.enterAppellantName}`);
    });

    test('MRN is over one month late, page do not enter a reason, page see errors', async({
      page
    }) => {
      await page
        .getByRole('button', { name: commonContent.continue })
        .first()
        .click();
      await expect(page).toHaveURL(paths.compliance.mrnOverMonthLate);
      await expect(
        page
          .getByText(
            mrnOverAMonthLateContent.fields.reasonForBeingLate.error.required
          )
          .first()
      ).toBeVisible();
    });

    test(`${language.toUpperCase()} - page enter a reason why my appeal is late, it is less than five chars, page see errors`, async({
      page
    }) => {
      await page.locator('#reasonForBeingLate').fill('n/a');
      await page
        .getByRole('button', { name: commonContent.continue })
        .first()
        .click();
      await expect(page).toHaveURL(paths.compliance.mrnOverMonthLate);
      await expect(
        page
          .getByText(
            mrnOverAMonthLateContent.fields.reasonForBeingLate.error.notEnough
          )
          .first()
      ).toBeVisible();
    });

    test(`${language.toUpperCase()} - page enter a reason why my appeal is late with a special character, page see errors`, async({
      page
    }) => {
      await page.locator('#reasonForBeingLate').fill('<Reason for being late>');
      await page
        .getByRole('button', { name: commonContent.continue })
        .first()
        .click();
      await expect(page).toHaveURL(paths.compliance.mrnOverMonthLate);
      await expect(
        page
          .getByText(
            mrnOverAMonthLateContent.fields.reasonForBeingLate.error.invalid
          )
          .first()
      ).toBeVisible();
    });
  }
);
