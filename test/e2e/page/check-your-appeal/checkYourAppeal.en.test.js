const language = 'en';
const commonContent = require('commonContent')[language];
const checkYourAppealContent = require(`steps/check-your-appeal/content.${language}`);
const paths = require('paths');

const { test } = require('@playwright/test');
test.describe(`${language.toUpperCase()} - Check-your-appeal @functional`, () => {
  Before(async ({ page }) => {
    await createTheSession(page, language);
  });

  After(async ({ page }) => {
    await endTheSession(page);
  });

  test(`${language.toUpperCase()} - When the appeal is incomplete, I am taken to the next step that needs completing`, ({
    page,
  }) => {
    page.goto(paths.checkYourAppeal);
    expect(page.getByText('Check your answers')).toBeVisible();
    expect(page.getByText('Your application is incomplete')).toBeVisible();
    expect(page.getByText('There are still some questions to answer.')).toBeVisible();
    await page.click('Continue your application');
    page.seeCurrentUrlEquals('/benefit-type');
  });

  test(`${language.toUpperCase()} - When I go to the check your appeal page, I don't see the Sign and submit section`, ({
    page,
  }) => {
    enterBenefitTypeAndContinue(page, language, commonContent, 'pip');
    page.goto(paths.checkYourAppeal);
    page.dontSee(checkYourAppealContent.header);
  });
});
