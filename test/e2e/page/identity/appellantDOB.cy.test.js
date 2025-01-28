const language = 'cy';
const commonContent = require('commonContent')[language];
const appellantDOBContent = require(`steps/identity/appellant-dob/content.${language}`);
const paths = require('paths');

const { test, expect } = require('@playwright/test');
const {
  enterAppellantDOBAndContinue
} = require('../../page-objects/identity/appellantDetails');
const { endTheSession } = require('../../page-objects/session/endSession');
const { createTheSession } = require('../../page-objects/session/createSession');

test.describe(`${language.toUpperCase()} - Appellant DOB form`, { tag: '@batch-09' }, () => {
  test.beforeEach('Create session', async({ page }) => {
    await createTheSession(page, language);
    await page.goto(paths.identity.enterAppellantDOB);
  });

  test.afterEach('End session', async({ page }) => {
    await endTheSession(page);
  });

  test(`${language.toUpperCase()} - When page complete the form and click Continue, page am taken to /enter-appellant-nino`, async({ page }) => {
    await enterAppellantDOBAndContinue(page, '21', '03', '1981');
    await expect(page).toHaveURL(paths.identity.enterAppellantNINO);
  });

  test(`${language.toUpperCase()} - When page click Continue without filling in the fields page see errors`, async({ page }) => {
    await page.getByRole('button', { name: commonContent.continue }).first().click();
    await expect(page.getByText(appellantDOBContent.fields.date.error.allRequired).first()).toBeVisible();
  });

  test(`${language.toUpperCase()} - When page click Continue when only entering the day field page see errors`, async({ page }) => {
    await page.locator('input[name*="day"]').first().fill('21');
    await page.getByRole('button', { name: commonContent.continue }).first().click();
    await expect(page.getByText(appellantDOBContent.fields.date.error.monthRequired).first()).toBeVisible();
    await expect(page.getByText(appellantDOBContent.fields.date.error.yearRequired).first()).toBeVisible();
  });

  test(`${language.toUpperCase()} - When page click Continue when only entering the month field page see errors`, async({ page }) => {
    await page.locator('input[name*="month"]').first().fill('12');
    await page.getByRole('button', { name: commonContent.continue }).first().click();
    await expect(page.getByText(appellantDOBContent.fields.date.error.yearRequired).first()).toBeVisible();
    await expect(page.getByText(appellantDOBContent.fields.date.error.dayRequired).first()).toBeVisible();
  });

  test(`${language.toUpperCase()} - When page click Continue when only entering the year field page see errors`, async({ page }) => {
    await page.locator('input[name*="year"]').first().fill('1999');
    await page.getByRole('button', { name: commonContent.continue }).first().click();
    await expect(page.getByText(appellantDOBContent.fields.date.error.monthRequired).first()).toBeVisible();
    await expect(page.getByText(appellantDOBContent.fields.date.error.dayRequired).first()).toBeVisible();
  });

  test(`${language.toUpperCase()} - When page enter an invalid date page see errors`, async({ page }) => {
    await enterAppellantDOBAndContinue(page, '30', '02', '1981');
    await expect(page.getByText(appellantDOBContent.fields.date.error.invalid).first()).toBeVisible();
  });

  test(`${language.toUpperCase()} - When page enter a date in the future page see errors`, async({ page }) => {
    await enterAppellantDOBAndContinue(page, '25', '02', '3400');
    await expect(page.getByText(appellantDOBContent.fields.date.error.future).first()).toBeVisible();
  });

  test(`${language.toUpperCase()} - page enter a dob with name of month`, async({ page }) => {
    await enterAppellantDOBAndContinue(page, '21', 'March', '1981');
    await expect(page).toHaveURL(paths.identity.enterAppellantNINO);
  });

  test(`${language.toUpperCase()} - page enter a dob with the short name of month`, async({ page }) => {
    await enterAppellantDOBAndContinue(page, '21', 'Jul', '1981');
    await expect(page).toHaveURL(paths.identity.enterAppellantNINO);
  });

  test(`${language.toUpperCase()} - page enter a dob with an invalid name of month`, async({ page }) => {
    await enterAppellantDOBAndContinue(page, '21', 'invalidMonth', '1981');
    await expect(page.getByText(appellantDOBContent.fields.date.error.invalid).first()).toBeVisible();
  });
});
