const language = 'cy';
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
    expect(page.getByText('Gwiriwch eich atebion')).toBeVisible();
    expect(page.getByText('Mae eich cais yn anghyflawn')).toBeVisible();
    expect(page.getByText('Mae yna gwestiynau nad ydych wedi’u hateb.')).toBeVisible();
    await page.click('Parhau á’ch cais');
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
