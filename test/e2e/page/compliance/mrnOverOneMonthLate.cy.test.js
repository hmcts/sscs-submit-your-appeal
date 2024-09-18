const language = 'cy';
const commonContent = require('commonContent')[language];
const mrnOverAMonthLateContent = require(`steps/compliance/mrn-over-month-late/content.${language}`);
const paths = require('paths');

const { test } = require('@playwright/test');
test.describe(`${language.toUpperCase()} - MRN Over one month late @batch-07`, () => {
  Before(async ({ page }) => {
    await createTheSession(page, language);
    page.goto(paths.compliance.mrnOverMonthLate);
  });

  After(async ({ page }) => {
    await endTheSession(page);
  });

  test(`${language.toUpperCase()} - I enter a lateness reason, I click continue, I am taken to /enter-appellant-name`, ({
    page,
  }) => {
    await page.fill('#reasonForBeingLate', 'Reason for being late');
    await page.click(commonContent.continue);
    page.seeInCurrentUrl(paths.identity.enterAppellantName);
  });

  test('MRN is over one month late, I do not enter a reason, I see errors', ({ page }) => {
    await page.click(commonContent.continue);
    page.seeCurrentUrlEquals(paths.compliance.mrnOverMonthLate);
    expect(page.getByText(mrnOverAMonthLateContent.fields.reasonForBeingLate.error.required)).toBeVisible();
  });

  test(`${language.toUpperCase()} - I enter a reason why my appeal is late, it is less than five chars, I see errors`, ({
    page,
  }) => {
    await page.fill('#reasonForBeingLate', 'n/a');
    await page.click(commonContent.continue);
    page.seeCurrentUrlEquals(paths.compliance.mrnOverMonthLate);
    expect(page.getByText(mrnOverAMonthLateContent.fields.reasonForBeingLate.error.notEnough)).toBeVisible();
  });

  test(`${language.toUpperCase()} - I enter a reason why my appeal is late with a special character, I see errors`, ({
    page,
  }) => {
    await page.fill('#reasonForBeingLate', '<Reason for being late>');
    await page.click(commonContent.continue);
    page.seeCurrentUrlEquals(paths.compliance.mrnOverMonthLate);
    expect(page.getByText(mrnOverAMonthLateContent.fields.reasonForBeingLate.error.invalid)).toBeVisible();
  });
});
