const language = 'cy';
const cantAppealContent = require(`../../../../steps/compliance/cant-appeal/content.${language}`);
const paths = require('../../../../paths');

const { test, expect } = require('@playwright/test');
const { createTheSession } = require('../../page-objects/session/createSession');
const { endTheSession } = require('../../page-objects/session/endSession');
const { config } = require('config');

/* eslint-disable-next-line no-process-env */
const baseUrl = process.env.TEST_URL || config.get('e2e.frontendUrl');

test.describe(`${language.toUpperCase()} - Cannot appeal @batch-07`, () => {
  test.beforeEach('Initial navigation', async({ page }) => {
    await createTheSession(page, language);
    await page.goto(baseUrl + paths.compliance.cantAppeal);
  });

  test.afterEach('Close down', async({ page }) => {
    await endTheSession(page);
  });

  test(`${language.toUpperCase()} - I exit the service after being told I cannot appeal`, async({ page }) => {
    await page.getByText(cantAppealContent.govuk).first().click();
    await page.goto('https://www.gov.uk');
  });

  test(`${language.toUpperCase()} - I have a csrf token`, async({ page }) => {
    await expect(page.locator('form input[name="_csrf"]').first()).toBeVisible();
  });
});
