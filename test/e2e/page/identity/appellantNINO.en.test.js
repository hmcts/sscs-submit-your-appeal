const language = 'en';
const commonContent = require('commonContent')[language];
const appellantNinoContent = require(
  `steps/identity/appellant-nino/content.${language}`
);
const paths = require('paths');

const { test, expect } = require('@playwright/test');
const {
  createTheSession
} = require('../../page-objects/session/createSession');
const { endTheSession } = require('../../page-objects/session/endSession');

test.describe(`${language.toUpperCase()} - Appellant NINO form @batch-09`, () => {
  Before(async({ page }) => {
    await createTheSession(page, language);
    await page.goto(paths.identity.enterAppellantNINO);
  });

  After(async({ page }) => {
    await endTheSession(page);
  });

  test(`${language.toUpperCase()} - I see the correct information is displayed`, async({
    page
  }) => {
    await expect(
      page.getByText(appellantNinoContent.title.withoutAppointee)
    ).toBeVisible();
    await expect(
      page.getByText(appellantNinoContent.subtitle.withoutAppointee)
    ).toBeVisible();
  });

  test(`${language.toUpperCase()} - The user has entered a NINO in the correct format (e.g. AA123456A) and continued`, async({
    page
  }) => {
    await page.fill('#nino', 'AA123456A');
    await page.click(commonContent.continue);
    await page.waitForURL(`**/${paths.identity.enterAppellantContactDetails}`);
  });

  test(`${language.toUpperCase()} - The user has entered a NINO in the wrong format (e.g.AA1234) and continued`, async({
    page
  }) => {
    await page.fill('#nino', 'AA1234');
    await page.click(commonContent.continue);
    await expect(page.locator('#error-summary-title').first()).toBeVisible();
    await expect(page.getByText('There was a problem')).toBeVisible();
    await expect(
      page.getByText(appellantNinoContent.fields.nino.error.required)
    ).toBeVisible();
  });
});
