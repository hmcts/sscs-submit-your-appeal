const language = 'en';
const commonContent = require('commonContent')[language];
const representativeDetailsContent = require(`steps/representative/representative-details/content.${language}`);
const paths = require('paths');

const { test, expect } = require('@playwright/test');
const { createTheSession } = require('../../page-objects/session/createSession');
const { endTheSession } = require('../../page-objects/session/endSession');
const { enterRequiredRepresentativeDetails } = require('../../page-objects/representative/representativeDetails');

test.describe(`${language.toUpperCase()} - Representative Details @batch-10`, () => {
  test.beforeEach('Initial navigation', async({ page }) => {
    await createTheSession(page, language);
    await page.goto(paths.representative.representativeDetails);
  });

  test.afterEach('Close down', async({ page }) => {
    await endTheSession(page);
  });

  test(`${language.toUpperCase()} - After completing the form I am taken to the /reasons-for-appealing page`, async({ page }) => {
    await enterRequiredRepresentativeDetails(page);
    await page.getByText(commonContent.continue).first().click();
    await page.waitForURL(`**/${paths.reasonsForAppealing.reasonForAppealing}`);
  });

  test(`${language.toUpperCase()} - When I only provide a single character for firstName and lastName I see errors`, async({ page }) => {
    await page.fill('input[name="name.first"]', 'H');
    await page.fill('input[name="name.last"]', 'P');
    await page.getByText(commonContent.continue).first().click();
    await expect(page.getByText(representativeDetailsContent.fields.name.first.error.invalid).first()).toBeVisible();
    await expect(page.getByText(representativeDetailsContent.fields.name.last.error.invalid).first()).toBeVisible();
  });

  test(`${language.toUpperCase()} - When I click continue without filling in the fields I see errors`, async({ page }) => {
    await page.getByText(commonContent.continue).first().click();
    await expect(page.getByText(representativeDetailsContent.fields.name.error.required).first()).toBeVisible();
    await expect(page.getByText(representativeDetailsContent.fields.addressLine1.error.required).first()).toBeVisible();
    await expect(page.getByText(representativeDetailsContent.fields.townCity.error.required).first()).toBeVisible();
    await expect(page.getByText(representativeDetailsContent.fields.county.error.required).first()).toBeVisible();
    await expect(page.getByText(representativeDetailsContent.fields.postCode.error.required).first()).toBeVisible();
  });

  test(`${language.toUpperCase()} - When I click continue without entering a name or organisation, I see errors`, async({ page }) => {
    await page.getByText(commonContent.continue).first().click();
    await expect(page.getByText(representativeDetailsContent.fields.name.error.required).first()).toBeVisible();
  });

  test(`${language.toUpperCase()} - When I enter a name and continue, I do not see errors`, async({ page }) => {
    await page.fill('input[name="name.first"]', 'Harry');
    await page.getByText(commonContent.continue).first().click();
    await expect(page.getByText(representativeDetailsContent.fields.name.error.required)).not.toBeVisible();
  });

  test(`${language.toUpperCase()} - When I enter a name with special characters and continue, I do not see errors`, async({ page }) => {
    await page.fill('input[name="name.first"]', 'André-Ottö');
    await page.getByText(commonContent.continue).first().click();
    await expect(page.getByText(representativeDetailsContent.fields.name.error.required)).not.toBeVisible();
  });

  test(`${language.toUpperCase()} - When I enter an organisation and continue, I do not see errors`, async({ page }) => {
    await page.fill('input[name="name.organisation"]', 'Hogwarts');
    await page.getByText(commonContent.continue).first().click();
    await expect(page.getByText(representativeDetailsContent.fields.name.error.required)).not.toBeVisible();
  });
});
