const language = 'cy';
const commonContent = require('commonContent')[language];
const reasonsForAppealingContent = require(`steps/reasons-for-appealing/reason-for-appealing/content.${language}`);
const paths = require('paths');
const reasons = require('test/e2e/data.en').reasonsForAppealing.reasons;

const { test, expect } = require('@playwright/test');
const { createTheSession } = require('../../page-objects/session/createSession');
const { endTheSession } = require('../../page-objects/session/endSession');

test.describe(`${language.toUpperCase()} - Reason For Appealing`, { tag: '@batch-10' }, () => {
  test.beforeEach(async({ page }) => {
    await createTheSession(page, language);
    await page.goto(paths.reasonsForAppealing.reasonForAppealing);
    await page.turnOffJsAndReloadThePage();
  });

  test.afterEach('End session', async({ page }) => {
    await endTheSession(page);
  });

  test(`${language.toUpperCase()} - When page do not add enough what you disagree with it, page see errors`, async({ page }) => {
    await page.getByText(reasonsForAppealingContent.links.add).first().click();
    await page.locator('textarea[name="item.reasonForAppealing"]').first().fill(reasons[0].reasonForAppealing);
    await page.locator('input[name="item.whatYouDisagreeWith"]').first().fill(reasons[3].whatYouDisagreeWith);
    await page.getByRole('button', { name: commonContent.continue }).first().click();
    await expect(page.getByText(reasonsForAppealingContent.fields.whatYouDisagreeWith.error.notEnough).first()).toBeVisible();
  });

  test(`${language.toUpperCase()} - When page do not add enough reason for appealing, page see errors`, async({ page }) => {
    await page.getByText(reasonsForAppealingContent.links.add).first().click();
    await page.locator('textarea[name="item.reasonForAppealing"]').first().fill(reasons[3].reasonForAppealing);
    await page.locator('input[name="item.whatYouDisagreeWith"]').first().fill(reasons[0].whatYouDisagreeWith);
    await page.getByRole('button', { name: commonContent.continue }).first().click();
    await expect(page.getByText(reasonsForAppealingContent.fields.reasonForAppealing.error.notEnough).first()).toBeVisible();
  });

  test(`${language.toUpperCase()} - When page use whitespace to pad out what you disagree with it, page see errors`, async({ page }) => {
    await page.getByText(reasonsForAppealingContent.links.add).first().click();
    await page.locator('textarea[name="item.reasonForAppealing"]').first().fill(reasons[0].reasonForAppealing);
    await page.locator('input[name="item.whatYouDisagreeWith"]').first().fill(reasons[4].whatYouDisagreeWith);
    await page.getByRole('button', { name: commonContent.continue }).first().click();
    await expect(page.getByText(reasonsForAppealingContent.fields.whatYouDisagreeWith.error.notEnough).first()).toBeVisible();
  });

  test(`${language.toUpperCase()} - When page use whitespace to pad out reason for appealing, page see errors`, async({ page }) => {
    await page.getByText(reasonsForAppealingContent.links.add).first().click();
    await page.locator('textarea[name="item.reasonForAppealing"]').first().fill(reasons[4].reasonForAppealing);
    await page.locator('input[name="item.whatYouDisagreeWith"]').first().fill(reasons[0].whatYouDisagreeWith);
    await page.getByRole('button', { name: commonContent.continue }).first().click();
    await expect(page.getByText(reasonsForAppealingContent.fields.reasonForAppealing.error.notEnough).first()).toBeVisible();
  });

  test(`${language.toUpperCase()} - page have a csrf token`, async({ page }) => {
    await expect(page.locator('form input[name="_csrf"]').first()).toBeVisible();
  });
});
