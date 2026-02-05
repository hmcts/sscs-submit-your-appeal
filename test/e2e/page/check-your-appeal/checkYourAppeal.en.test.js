const language = 'en';
const commonContent = require('commonContent')[language];
const checkYourAppealContent = require(
  `steps/check-your-appeal/content.${language}`
);
const paths = require('paths');

const { test, expect } = require('@playwright/test');
const {
  enterBenefitTypeAndContinue
} = require('../../page-objects/start/benefit-type');
const { endTheSession } = require('../../page-objects/session/endSession');
const {
  createTheSession
} = require('../../page-objects/session/createSession');

test.describe(`${language.toUpperCase()} - Check-your-appeal @functional`, () => {
  test.beforeEach('Create session', async ({ page }) => {
    await createTheSession(page, language);
  });

  test.afterEach('End session', async ({ page }) => {
    await endTheSession(page);
  });

  test(`${language.toUpperCase()} - When the appeal is incomplete, page am taken to the next step that needs completing`, async ({
    page
  }) => {
    await page.goto(paths.checkYourAppeal);
    await expect(page.getByText('Check your answers').first()).toBeVisible();
    await expect(
      page.getByText('Your application is incomplete').first()
    ).toBeVisible();
    await expect(
      page.getByText('There are still some questions to answer.').first()
    ).toBeVisible();
    await page.getByText('Continue your application').first().click();
    await expect(page).toHaveURL('/benefit-type');
  });

  test(`${language.toUpperCase()} - When page go to the check your appeal page, page don't see the Sign and submit section`, async ({
    page
  }) => {
    await enterBenefitTypeAndContinue(page, language, commonContent, 'pip');
    await page.goto(paths.checkYourAppeal);
    await expect(
      page.getByText(checkYourAppealContent.header).first()
    ).toBeHidden();
  });
});
