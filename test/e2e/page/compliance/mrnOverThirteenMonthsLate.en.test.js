const language = 'en';
const commonContent = require('commonContent')[language];
const mrnOverThirteenMonthsLateContent = require(
  `steps/compliance/mrn-over-thirteen-months-late/content.${language}`
);
const paths = require('paths');

const { test, expect } = require('@playwright/test');
const {
  createTheSession
} = require('../../page-objects/session/createSession');
const { endTheSession } = require('../../page-objects/session/endSession');

test.describe(
  `${language.toUpperCase()} - MRN Over thirteen months late`,
  { tag: '@batch-07' },
  () => {
    test.beforeEach('Create session', async({ page }) => {
      await createTheSession(page, language);
      await page.goto(paths.compliance.mrnOverThirteenMonthsLate);
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

    test(`${language.toUpperCase()} - MRN is over 13 months late, page omit a reason why my appeal is late, page see errors`, async({
      page
    }) => {
      await page
        .getByRole('button', { name: commonContent.continue })
        .first()
        .click();
      await expect(page).toHaveURL(paths.compliance.mrnOverThirteenMonthsLate);
      await expect(
        page
          .getByText(
            mrnOverThirteenMonthsLateContent.fields.reasonForBeingLate.error
              .required
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
      await expect(page).toHaveURL(paths.compliance.mrnOverThirteenMonthsLate);
      await expect(
        page
          .getByText(
            mrnOverThirteenMonthsLateContent.fields.reasonForBeingLate.error
              .notEnough
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
      await expect(page).toHaveURL(paths.compliance.mrnOverThirteenMonthsLate);
      await expect(
        page
          .getByText(
            mrnOverThirteenMonthsLateContent.fields.reasonForBeingLate.error
              .invalid
          )
          .first()
      ).toBeVisible();
    });
  }
);
