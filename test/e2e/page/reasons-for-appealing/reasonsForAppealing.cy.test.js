const language = 'cy';
const commonContent = require('commonContent')[language];
const reasonsForAppealingContent = require(`steps/reasons-for-appealing/reason-for-appealing/content.${language}`);
const paths = require('paths');
const reasons = require('test/e2e/data.en').reasonsForAppealing.reasons;

const { test, expect } = require('@playwright/test');
const { createTheSession } = require('../../page-objects/session/createSession');
const { endTheSession } = require('../../page-objects/session/endSession');

test.describe(`${language.toUpperCase()} - Reason For Appealing @batch-10`, () => {
  test.beforeEach('Initial navigation', async({ page }) => {
    await createTheSession(page, language);
    await page.goto(paths.reasonsForAppealing.reasonForAppealing);
    // await page.turnOffJsAndReloadThePage();
  });

  test.afterEach('Close down', async({ page }) => {
    await endTheSession(page);
  });

  test(`${language.toUpperCase()} - When I do not add enough what you disagree with it, I see errors`, async({ page }) => {
    await page.getByText(reasonsForAppealingContent.links.add).first().click();
    await page.fill('textarea[name="item.reasonForAppealing"]', reasons[0].reasonForAppealing);
    await page.fill('input[name="item.whatYouDisagreeWith"]', reasons[3].whatYouDisagreeWith);
    await page.getByText(commonContent.continue).first().click();
    await expect(page.getByText(reasonsForAppealingContent.fields.whatYouDisagreeWith.error.notEnough).first()).toBeVisible();
  });

  test(`${language.toUpperCase()} - When I do not add enough reason for appealing, I see errors`, async({ page }) => {
    await page.getByText(reasonsForAppealingContent.links.add).first().click();
    await page.fill('textarea[name="item.reasonForAppealing"]', reasons[3].reasonForAppealing);
    await page.fill('input[name="item.whatYouDisagreeWith"]', reasons[0].whatYouDisagreeWith);
    await page.getByText(commonContent.continue).first().click();
    await expect(page.getByText(reasonsForAppealingContent.fields.reasonForAppealing.error.notEnough).first()).toBeVisible();
  });

  test(`${language.toUpperCase()} - When I use whitespace to pad out what you disagree with it, I see errors`, async({ page }) => {
    await page.getByText(reasonsForAppealingContent.links.add).first().click();
    await page.fill('textarea[name="item.reasonForAppealing"]', reasons[0].reasonForAppealing);
    await page.fill('input[name="item.whatYouDisagreeWith"]', reasons[4].whatYouDisagreeWith);
    await page.getByText(commonContent.continue).first().click();
    await expect(page.getByText(reasonsForAppealingContent.fields.whatYouDisagreeWith.error.notEnough).first()).toBeVisible();
  });

  test(`${language.toUpperCase()} - When I use whitespace to pad out reason for appealing, I see errors`, async({ page }) => {
    await page.getByText(reasonsForAppealingContent.links.add).first().click();
    await page.fill('textarea[name="item.reasonForAppealing"]', reasons[4].reasonForAppealing);
    await page.fill('input[name="item.whatYouDisagreeWith"]', reasons[0].whatYouDisagreeWith);
    await page.getByText(commonContent.continue).first().click();
    await expect(page.getByText(reasonsForAppealingContent.fields.reasonForAppealing.error.notEnough).first()).toBeVisible();
  });

  test(`${language.toUpperCase()} - I have a csrf token`, async({ page }) => {
    await expect(page.locator('form input[name="_csrf"]').first()).toBeVisible();
  });
});
