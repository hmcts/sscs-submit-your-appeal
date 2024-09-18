const language = 'en';
const commonContent = require('commonContent')[language];
const postcodeCheckerContent = require(`steps/start/postcode-checker/content.${language}`);
const paths = require('paths');

const { test } = require('@playwright/test');
test.describe(`${language.toUpperCase()} - Enter postcode`, () => {

  Before(async ({ page }) => {
    await createTheSession(page, language);
    page.goto(paths.start.postcodeCheck);
  });

  test(`${language.toUpperCase()} - When I go to the enter postcode page I see the page heading`, ({ page }) => {
    expect(page.getByText(postcodeCheckerContent.title)).toBeVisible();
  });

  test(`${language.toUpperCase()} - When entering a postcode in England, I go to the /are-you-an-appointee page`, ({
                                                                                                                     page,
                                                                                                                   }) => {
    await page.fill('#postcode', 'WV11 2HE');
    await page.click(commonContent.continue);
    page.seeInCurrentUrl(paths.identity.areYouAnAppointee);
  });

  test(`${language.toUpperCase()} - When I enter a postcode in Scotland, I go to the /invalid postcode page`, ({ page }) => {
    await page.fill('#postcode', 'EH8 8DX');
    await page.click(commonContent.continue);
    page.seeInCurrentUrl(paths.start.invalidPostcode);
  });

  test(`${language.toUpperCase()} - When I enter an invalid postcode I see an error`, ({ page }) => {
    await page.fill('#postcode', 'INVALID POSTCODE');
    await page.click(commonContent.continue);
    page.seeInCurrentUrl(paths.start.postcodeCheck);
    expect(page.getByText(postcodeCheckerContent.fields.postcode.error.invalid)).toBeVisible();
  });

  test(`${language.toUpperCase()} - When I leave the postcode field empty and continue, I see an error`, ({ page }) => {
    await page.fill('#postcode', '');
    await page.click(commonContent.continue);
    page.seeInCurrentUrl(paths.start.postcodeCheck);
    expect(page.getByText(postcodeCheckerContent.fields.postcode.error.emptyField)).toBeVisible();
  });
});