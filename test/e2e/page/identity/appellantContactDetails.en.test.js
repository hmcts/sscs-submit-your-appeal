/* eslint-disable no-useless-escape */
const language = 'en';
const commonContent = require('../../../../commonContent')[language];
const appellantContactDetailsContent = require(`../../../../steps/identity/appellant-contact-details/content.${language}`);
const paths = require('../../../../paths');

const appellant = require('../../data.en').appellant;

const { test, expect } = require('@playwright/test');
const { createTheSession } = require('../../page-objects/session/createSession');
const { endTheSession } = require('../../page-objects/session/endSession');
const { config } = require('config');

/* eslint-disable-next-line no-process-env */
const baseUrl = process.env.TEST_URL || config.get('e2e.frontendUrl');

test.describe(`${language.toUpperCase()} - Appellant details form @batch-09`, () => {
  test.beforeEach('Initial navigation', async({ page }) => {
    await createTheSession(page, language);
    await page.goto(baseUrl + paths.identity.enterAppellantContactDetails);
  });

  test.afterEach('Close down', async({ page }) => {
    await endTheSession(page);
  });

  test(`${language.toUpperCase()} - When completing the form, clicking Continue, I see url /appellant-text-reminders`, async({ page }) => {
    await page.fill('addressLine1', appellant.contactDetails.addressLine1);
    await page.fill('addressLine2', appellant.contactDetails.addressLine2);
    await page.fill('townCity', appellant.contactDetails.townCity);
    await page.fill('county', appellant.contactDetails.county);
    await page.fill('postCode', appellant.contactDetails.postCode);
    await page.fill('phoneNumber', appellant.contactDetails.phoneNumber);
    await page.fill('emailAddress', appellant.contactDetails.emailAddress);
    await page.getByText(commonContent.continue).first().click();
    await page.waitForURL(`**\/${paths.smsNotify.appellantTextReminders}`);
  });

  test(`${language.toUpperCase()} - When I click Continue without completing the form I see errors`, async({ page }) => {
    await page.getByText(commonContent.continue).first().click();
    await expect(page.getByText(appellantContactDetailsContent.fields.addressLine1.error.required).first()).toBeVisible();
    await expect(page.getByText(appellantContactDetailsContent.fields.townCity.error.required).first()).toBeVisible();
    await expect(page.getByText(appellantContactDetailsContent.fields.county.error.required).first()).toBeVisible();
    await expect(page.getByText(appellantContactDetailsContent.fields.postCode.error.required).first()).toBeVisible();
  });

  test(`${language.toUpperCase()} - When I click Continue with a postcode that is not in England or Wales I see error`, async({ page }) => {
    if (config.get('postcodeChecker.enabled')) {
      await page.fill('addressLine1', appellant.contactDetails.addressLine1);
      await page.fill('addressLine2', appellant.contactDetails.addressLine2);
      await page.fill('townCity', appellant.contactDetails.townCity);
      await page.fill('county', appellant.contactDetails.county);
      await page.fill('postCode', 'ZX99 1AB');
      await page.fill('phoneNumber', appellant.contactDetails.phoneNumber);
      await page.fill('emailAddress', appellant.contactDetails.emailAddress);
      await page.getByText(commonContent.continue).first().click();

      await page.waitForURL(`**\/${paths.smsNotify.appellantTextReminders}`);
    }
  });

  test(`${language.toUpperCase()} - I have a csrf token`, async({ page }) => {
    await expect(page.locator('form input[name="_csrf"]').first()).toBeVisible();
  });
});
