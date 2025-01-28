const language = 'cy';
const commonContent = require('commonContent')[language];
const representativeDetailsContent = require(`steps/representative/representative-details/content.${language}`);
const paths = require('paths');

const { test, expect } = require('@playwright/test');
const { enterRequiredRepresentativeDetails } = require('../../page-objects/representative/representativeDetails');
const { endTheSession } = require('../../page-objects/session/endSession');
const { createTheSession } = require('../../page-objects/session/createSession');

test.describe(`${language.toUpperCase()} - Representative Details`, { tag: '@batch-10' }, () => {
  test.beforeEach('Create session', async({ page }) => {
    await createTheSession(page, language);
    await page.goto(paths.representative.representativeDetails);
  });

  test.afterEach('End session', async({ page }) => {
    await endTheSession(page);
  });

  test(`${language.toUpperCase()} - After completing the form page am taken to the /reasons-for-appealing page`, async({ page }) => {
    await enterRequiredRepresentativeDetails(page);
    await page.getByRole('button', { name: commonContent.continue }).first().click();
    await page.waitForURL(`**${paths.reasonsForAppealing.reasonForAppealing}`);
  });

  test(`${language.toUpperCase()} - When page only provide a single character for firstName and lastName page see errors`, async({ page }) => {
    await page.locator('input[name="name.first"]').first().fill('H');
    await page.locator('input[name="name.last"]').first().fill('P');
    await page.getByRole('button', { name: commonContent.continue }).first().click();
    await expect(page.getByText(representativeDetailsContent.fields.name.first.error.invalid).first()).toBeVisible();
    await expect(page.getByText(representativeDetailsContent.fields.name.last.error.invalid).first()).toBeVisible();
  });

  test(`${language.toUpperCase()} - When page click continue without filling in the fields page see errors`, async({ page }) => {
    await page.getByRole('button', { name: commonContent.continue }).first().click();
    await expect(page.getByText(representativeDetailsContent.fields.name.error.required).first()).toBeVisible();
    await expect(page.getByText(representativeDetailsContent.fields.addressLine1.error.required).first()).toBeVisible();
    await expect(page.getByText(representativeDetailsContent.fields.townCity.error.required).first()).toBeVisible();
    await expect(page.getByText(representativeDetailsContent.fields.county.error.required).first()).toBeVisible();
    await expect(page.getByText(representativeDetailsContent.fields.postCode.error.required).first()).toBeVisible();
  });

  test(`${language.toUpperCase()} - When page click continue without entering a name or organisation, page see errors`, async({ page }) => {
    await page.getByRole('button', { name: commonContent.continue }).first().click();
    await expect(page.getByText(representativeDetailsContent.fields.name.error.required).first()).toBeVisible();
  });

  test(`${language.toUpperCase()} - When page enter a name and continue, page do not see errors`, async({ page }) => {
    await page.locator('input[name="name.first"]').first().fill('Harry');
    await page.getByRole('button', { name: commonContent.continue }).first().click();
    await expect(page.getByText(representativeDetailsContent.fields.name.error.required).first()).toBeHidden();
  });

  test(`${language.toUpperCase()} - When page enter a name with special characters and continue, page do not see errors`, async({ page }) => {
    await page.locator('input[name="name.first"]').first().fill('André-Ottö');
    await page.getByRole('button', { name: commonContent.continue }).first().click();
    await expect(page.getByText(representativeDetailsContent.fields.name.error.required).first()).toBeHidden();
  });

  test(`${language.toUpperCase()} - When page enter an organisation and continue, page do not see errors`, async({ page }) => {
    await page.locator('input[name="name.organisation"]').first().fill('Hogwarts');
    await page.getByRole('button', { name: commonContent.continue }).first().click();
    await expect(page.getByText(representativeDetailsContent.fields.name.error.required).first()).toBeHidden();
  });
});
