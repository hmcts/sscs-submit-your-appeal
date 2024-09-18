const language = 'cy';
const commonContent = require('commonContent')[language];
const appellantNinoContent = require(`steps/identity/appellant-nino/content.${language}`);
const paths = require('paths');

const { test } = require('@playwright/test');
test.describe(`${language.toUpperCase()} - Appellant NINO form @batch-09`, () => {

  Before(async ({ page }) => {
    await createTheSession(page, language);
    page.goto(paths.identity.enterAppellantNINO);
  });

  After(async ({ page }) => {
    await endTheSession(page);
  });

  test(`${language.toUpperCase()} - I see the correct information is displayed`, ({ page }) => {
    expect(page.getByText(appellantNinoContent.title.withoutAppointee)).toBeVisible();
    expect(page.getByText(appellantNinoContent.subtitle.withoutAppointee)).toBeVisible();
  });

  test(`${language.toUpperCase()} - The user has entered a NINO in the correct format (e.g. AA123456A) and continued`, ({
                                                                                                                          page,
                                                                                                                        }) => {
    await page.fill('#nino', 'AA123456A');
    await page.click(commonContent.continue);
    page.seeInCurrentUrl(paths.identity.enterAppellantContactDetails);
  });

  test(`${language.toUpperCase()} - The user has entered a NINO in the wrong format (e.g.AA1234) and continued`, ({
                                                                                                                    page,
                                                                                                                  }) => {
    await page.fill('#nino', 'AA1234');
    await page.click(commonContent.continue);
    page.seeElement('#error-summary-title');
    expect(page.getByText('There was a problem')).toBeVisible();
    expect(page.getByText(appellantNinoContent.fields.nino.error.required)).toBeVisible();
  });
})