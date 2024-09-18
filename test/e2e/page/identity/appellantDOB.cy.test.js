const language = 'cy';
const commonContent = require('commonContent')[language];
const appellantDOBContent = require(`steps/identity/appellant-dob/content.${language}`);
const paths = require('paths');

const { test } = require('@playwright/test');
test.describe(`${language.toUpperCase()} - Appellant DOB form @batch-09`, () => {

  Before(async ({ page }) => {
    await createTheSession(page, language);
    page.goto(paths.identity.enterAppellantDOB);
  });

  After(async ({ page }) => {
    await endTheSession(page);
  });

  test(`${language.toUpperCase()} - When I complete the form and click Continue, I am taken to /enter-appellant-nino`, ({
                                                                                                                          page,
                                                                                                                        }) => {
    enterAppellantDOBAndContinue(page, '21', '03', '1981');
    page.seeCurrentUrlEquals(paths.identity.enterAppellantNINO);
  });

  test(`${language.toUpperCase()} - When I click Continue without filling in the fields I see errors`, ({ page }) => {
    await page.click(commonContent.continue);
    expect(page.getByText(appellantDOBContent.fields.date.error.allRequired)).toBeVisible();
  });

  test(`${language.toUpperCase()} - When I click Continue when only entering the day field I see errors`, ({ page }) => {
    await page.fill('input[name*="day"]', '21');
    await page.click(commonContent.continue);
    expect(page.getByText(appellantDOBContent.fields.date.error.monthRequired)).toBeVisible();
    expect(page.getByText(appellantDOBContent.fields.date.error.yearRequired)).toBeVisible();
  });

  test(`${language.toUpperCase()} - When I click Continue when only entering the month field I see errors`, ({ page }) => {
    await page.fill('input[name*="month"]', '12');
    await page.click(commonContent.continue);
    expect(page.getByText(appellantDOBContent.fields.date.error.yearRequired)).toBeVisible();
    expect(page.getByText(appellantDOBContent.fields.date.error.dayRequired)).toBeVisible();
  });

  test(`${language.toUpperCase()} - When I click Continue when only entering the year field I see errors`, ({ page }) => {
    await page.fill('input[name*="year"]', '1999');
    await page.click(commonContent.continue);
    expect(page.getByText(appellantDOBContent.fields.date.error.monthRequired)).toBeVisible();
    expect(page.getByText(appellantDOBContent.fields.date.error.dayRequired)).toBeVisible();
  });

  test(`${language.toUpperCase()} - When I enter an invalid date I see errors`, ({ page }) => {
    enterAppellantDOBAndContinue(page, '30', '02', '1981');
    expect(page.getByText(appellantDOBContent.fields.date.error.invalid)).toBeVisible();
  });

  test(`${language.toUpperCase()} - When I enter a date in the future I see errors`, ({ page }) => {
    enterAppellantDOBAndContinue(page, '25', '02', '3400');
    expect(page.getByText(appellantDOBContent.fields.date.error.future)).toBeVisible();
  });

  test(`${language.toUpperCase()} - I enter a dob with name of month`, ({ page }) => {
    enterAppellantDOBAndContinue(page, '21', 'March', '1981');
    page.seeCurrentUrlEquals(paths.identity.enterAppellantNINO);
  });

  test(`${language.toUpperCase()} - I enter a dob with the short name of month`, ({ page }) => {
    enterAppellantDOBAndContinue(page, '21', 'Jul', '1981');
    page.seeCurrentUrlEquals(paths.identity.enterAppellantNINO);
  });

  test(`${language.toUpperCase()} - I enter a dob with an invalid name of month`, ({ page }) => {
    enterAppellantDOBAndContinue(page, '21', 'invalidMonth', '1981');
    expect(page.getByText(appellantDOBContent.fields.date.error.invalid)).toBeVisible();
  });
});