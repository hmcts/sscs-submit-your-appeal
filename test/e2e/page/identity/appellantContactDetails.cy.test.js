const language = 'cy';
const commonContent = require('commonContent')[language];
const appellantContactDetailsContent = require(
  `steps/identity/appellant-contact-details/content.${language}`
);
const paths = require('paths');
const config = require('config');

const appellant = require('test/e2e/data.en').appellant;

const { test, expect } = require('@playwright/test');
const {
  createTheSession
} = require('../../page-objects/session/createSession');
const { endTheSession } = require('../../page-objects/session/endSession');

test.describe(`${language.toUpperCase()} - Appellant details form @batch-09`, () => {
  Before(async({ page }) => {
    await createTheSession(page, language);
    await page.goto(paths.identity.enterAppellantContactDetails);
  });

  After(async({ page }) => {
    await endTheSession(page);
  });

  test(`${language.toUpperCase()} - When completing the form, clicking Continue, I see url /appellant-text-reminders`, async({
    page
  }) => {
    await page.fill('addressLine1', appellant.contactDetails.addressLine1);
    await page.fill('addressLine2', appellant.contactDetails.addressLine2);
    await page.fill('townCity', appellant.contactDetails.townCity);
    await page.fill('county', appellant.contactDetails.county);
    await page.fill('postCode', appellant.contactDetails.postCode);
    await page.fill('phoneNumber', appellant.contactDetails.phoneNumber);
    await page.fill('emailAddress', appellant.contactDetails.emailAddress);
    await page.click(commonContent.continue);
    await page.waitForURL(`**/${paths.smsNotify.appellantTextReminders}`);
  });

  test(`${language.toUpperCase()} - When I click Continue without completing the form I see errors`, async({
    page
  }) => {
    await page.click(commonContent.continue);
    await expect(
      page.getByText(
        appellantContactDetailsContent.fields.addressLine1.error.required
      )
    ).toBeVisible();
    await expect(
      page.getByText(
        appellantContactDetailsContent.fields.townCity.error.required
      )
    ).toBeVisible();
    await expect(
      page.getByText(
        appellantContactDetailsContent.fields.county.error.required
      )
    ).toBeVisible();
    await expect(
      page.getByText(
        appellantContactDetailsContent.fields.postCode.error.required
      )
    ).toBeVisible();
  });

  test(`${language.toUpperCase()} - When I click Continue with a postcode that is not in England or Wales I see error`, async({
    page
  }) => {
    if (config.get('postcodeChecker.enabled')) {
      await page.fill('addressLine1', appellant.contactDetails.addressLine1);
      await page.fill('addressLine2', appellant.contactDetails.addressLine2);
      await page.fill('townCity', appellant.contactDetails.townCity);
      await page.fill('county', appellant.contactDetails.county);
      await page.fill('postCode', 'ZX99 1AB');
      await page.fill('phoneNumber', appellant.contactDetails.phoneNumber);
      await page.fill('emailAddress', appellant.contactDetails.emailAddress);
      await page.click(commonContent.continue);

      await page.waitForURL(`**/${paths.smsNotify.appellantTextReminders}`);
    }
  });

  test(`${language.toUpperCase()} - I have a csrf token`, async({ page }) => {
    await expect(
      page.locator('form input[name="_csrf"]').first()
    ).toBeVisible();
  });
});
