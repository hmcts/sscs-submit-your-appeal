const language = 'cy';
const commonContent = require('../../../../commonContent')[language];
const mrnOverAMonthLateContent = require(`../../../../steps/compliance/mrn-over-month-late/content.${language}`);
const paths = require('../../../../paths');

const { test, expect } = require('@playwright/test');
const { createTheSession } = require('../../page-objects/session/createSession');
const { endTheSession } = require('../../page-objects/session/endSession');
const { config } = require('config');

/* eslint-disable-next-line no-process-env */
const baseUrl = process.env.TEST_URL || config.get('e2e.frontendUrl');

test.describe(`${language.toUpperCase()} - MRN Over one month late @batch-07`, () => {
  test.beforeEach('Initial navigation', async({ page }) => {
    await createTheSession(page, language);
    await page.goto(baseUrl + paths.compliance.mrnOverMonthLate);
  });

  test.afterEach('Close down', async({ page }) => {
    await endTheSession(page);
  });

  test(`${language.toUpperCase()} - I enter a lateness reason, I click continue, I am taken to /enter-appellant-name`, async({ page }) => {
    await page.fill('#reasonForBeingLate', 'Reason for being late');
    await page.getByText(commonContent.continue).first().click();
    await page.waitForURL(`**/${paths.identity.enterAppellantName}`);
  });

  test('MRN is over one month late, I do not enter a reason, I see errors', async({ page }) => {
    await page.getByText(commonContent.continue).first().click();
    await page.waitForURL(`**/${paths.compliance.mrnOverMonthLate}`);
    await expect(page.getByText(mrnOverAMonthLateContent.fields.reasonForBeingLate.error.required).first()).toBeVisible();
  });

  test(`${language.toUpperCase()} - I enter a reason why my appeal is late, it is less than five chars, I see errors`, async({ page }) => {
    await page.fill('#reasonForBeingLate', 'n/a');
    await page.getByText(commonContent.continue).first().click();
    await page.waitForURL(`**/${paths.compliance.mrnOverMonthLate}`);
    await expect(page.getByText(mrnOverAMonthLateContent.fields.reasonForBeingLate.error.notEnough).first()).toBeVisible();
  });

  test(`${language.toUpperCase()} - I enter a reason why my appeal is late with a special character, I see errors`, async({ page }) => {
    await page.fill('#reasonForBeingLate', '<Reason for being late>');
    await page.getByText(commonContent.continue).first().click();
    await page.waitForURL(`**/${paths.compliance.mrnOverMonthLate}`);
    await expect(page.getByText(mrnOverAMonthLateContent.fields.reasonForBeingLate.error.invalid).first()).toBeVisible();
  });
});
