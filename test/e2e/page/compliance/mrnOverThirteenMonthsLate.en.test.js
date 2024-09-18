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

test.describe(`${language.toUpperCase()} - MRN Over thirteen months late @batch-07`, () => {
  Before(async({ page }) => {
    await createTheSession(page, language);
    await page.goto(paths.compliance.mrnOverThirteenMonthsLate);
  });

  After(async({ page }) => {
    await endTheSession(page);
  });

  test(`${language.toUpperCase()} - I enter a lateness reason, I click continue, I am taken to /enter-appellant-name`, async({
    page
  }) => {
    await page.fill('#reasonForBeingLate', 'Reason for being late');
    await page.click(commonContent.continue);
    await page.waitForURL(`**/${paths.identity.enterAppellantName}`);
  });

  test(`${language.toUpperCase()} - MRN is over 13 months late, I omit a reason why my appeal is late, I see errors`, async({
    page
  }) => {
    await page.click(commonContent.continue);
    await page.waitForURL(`**/${paths.compliance.mrnOverThirteenMonthsLate}`);
    await expect(
      page.getByText(
        mrnOverThirteenMonthsLateContent.fields.reasonForBeingLate.error
          .required
      )
    ).toBeVisible();
  });

  test(`${language.toUpperCase()} - I enter a reason why my appeal is late, it is less than five chars, I see errors`, async({
    page
  }) => {
    await page.fill('#reasonForBeingLate', 'n/a');
    await page.click(commonContent.continue);
    await page.waitForURL(`**/${paths.compliance.mrnOverThirteenMonthsLate}`);
    await expect(
      page.getByText(
        mrnOverThirteenMonthsLateContent.fields.reasonForBeingLate.error
          .notEnough
      )
    ).toBeVisible();
  });

  test(`${language.toUpperCase()} - I enter a reason why my appeal is late with a special character, I see errors`, async({
    page
  }) => {
    await page.fill('#reasonForBeingLate', '<Reason for being late>');
    await page.click(commonContent.continue);
    await page.waitForURL(`**/${paths.compliance.mrnOverThirteenMonthsLate}`);
    await expect(
      page.getByText(
        mrnOverThirteenMonthsLateContent.fields.reasonForBeingLate.error.invalid
      )
    ).toBeVisible();
  });
});
