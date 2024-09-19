/* eslint-disable no-useless-escape */
const language = 'cy';
const commonContent = require('../../../../commonContent')[language];
const checkYourAppealContent = require(`../../../../steps/check-your-appeal/content.${language}`);
const paths = require('../../../../paths');

const { test, expect } = require('@playwright/test');
const { createTheSession } = require('../../page-objects/session/createSession');
const { endTheSession } = require('../../page-objects/session/endSession');
const { enterBenefitTypeAndContinue } = require('../../page-objects/start/benefit-type');
const { config } = require('config');

/* eslint-disable-next-line no-process-env */
const baseUrl = process.env.TEST_URL || config.get('e2e.frontendUrl');

test.describe(`${language.toUpperCase()} - Check-your-appeal @functional`, () => {
  test.beforeEach('Initial navigation', async({ page }) => {
    await createTheSession(page, language);
  });

  test.afterEach('Close down', async({ page }) => {
    await endTheSession(page);
  });

  test(`${language.toUpperCase()} - When the appeal is incomplete, I am taken to the next step that needs completing`, async({ page }) => {
    await page.goto(baseUrl + paths.checkYourAppeal);
    await expect(page.getByText('Gwiriwch eich atebion').first()).toBeVisible();
    await expect(page.getByText('Mae eich cais yn anghyflawn').first()).toBeVisible();
    await expect(page.getByText('Mae yna gwestiynau nad ydych wedi’u hateb.').first()).toBeVisible();
    await page.getByText('Parhau á’ch cais').first().click();
    await page.waitForURL('**\/benefit-type');
  });

  test(`${language.toUpperCase()} - When I go to the check your appeal page, I don't see the Sign and submit section`, async({ page }) => {
    await enterBenefitTypeAndContinue(page, language, commonContent, 'pip');
    await page.goto(baseUrl + paths.checkYourAppeal);
    await expect(page.getByText(checkYourAppealContent.header)).not.toBeVisible();
  });
});
