const language = 'en';
const commonContent = require('commonContent')[language];
const appellantContactDetailsContent = require(
  `steps/identity/appellant-contact-details/content.${language}`
);
const paths = require('paths');
const config = require('config');

const appellant = require('test/e2e/data.en').appellant;

const { test, expect } = require('@playwright/test');
const { endTheSession } = require('../../page-objects/session/endSession');
const {
  createTheSession
} = require('../../page-objects/session/createSession');

test.describe(
  `${language.toUpperCase()} - Appellant details form`,
  { tag: '@batch-09' },
  () => {
    test.beforeEach('Create session', async ({ page }) => {
      await createTheSession(page, language);
      await page.goto(paths.identity.enterAppellantContactDetails);
    });

    test.afterEach('End session', async ({ page }) => {
      await endTheSession(page);
    });

    test(`${language.toUpperCase()} - When completing the form, clicking Continue, page see url /appellant-text-reminders`, async ({
      page
    }) => {
      await page
        .locator('#addressLine1')
        .first()
        .fill(appellant.contactDetails.addressLine1);
      await page
        .locator('#addressLine2')
        .first()
        .fill(appellant.contactDetails.addressLine2);
      await page
        .locator('#townCity')
        .first()
        .fill(appellant.contactDetails.townCity);
      await page
        .locator('#county')
        .first()
        .fill(appellant.contactDetails.county);
      await page
        .locator('#postCode')
        .first()
        .fill(appellant.contactDetails.postCode);
      await page
        .locator('#phoneNumber')
        .first()
        .fill(appellant.contactDetails.phoneNumber);
      await page
        .locator('#emailAddress')
        .first()
        .fill(appellant.contactDetails.emailAddress);
      await page
        .getByRole('button', { name: commonContent.continue })
        .first()
        .click();
      await expect(page).toHaveURL(paths.smsNotify.appellantTextReminders);
    });

    test(`${language.toUpperCase()} - When page click Continue without completing the form page see errors`, async ({
      page
    }) => {
      await page
        .getByRole('button', { name: commonContent.continue })
        .first()
        .click();
      await expect(
        page
          .getByText(
            appellantContactDetailsContent.fields.addressLine1.error.required
          )
          .first()
      ).toBeVisible();
      await expect(
        page
          .getByText(
            appellantContactDetailsContent.fields.townCity.error.required
          )
          .first()
      ).toBeVisible();
      await expect(
        page
          .getByText(
            appellantContactDetailsContent.fields.county.error.required
          )
          .first()
      ).toBeVisible();
      await expect(
        page
          .getByText(
            appellantContactDetailsContent.fields.postCode.error.required
          )
          .first()
      ).toBeVisible();
    });

    test(`${language.toUpperCase()} - When page click Continue with a postcode that is not in England or Wales page see error`, async ({
      page
    }) => {
      if (config.get('postcodeChecker.enabled')) {
        await page
          .locator('#addressLine1')
          .first()
          .fill(appellant.contactDetails.addressLine1);
        await page
          .locator('#addressLine2')
          .first()
          .fill(appellant.contactDetails.addressLine2);
        await page
          .locator('#townCity')
          .first()
          .fill(appellant.contactDetails.townCity);
        await page
          .locator('#county')
          .first()
          .fill(appellant.contactDetails.county);
        await page.locator('#postCode').first().fill('ZX99 1AB');
        await page
          .locator('#phoneNumber')
          .first()
          .fill(appellant.contactDetails.phoneNumber);
        await page
          .locator('#emailAddress')
          .first()
          .fill(appellant.contactDetails.emailAddress);
        await page
          .getByRole('button', { name: commonContent.continue })
          .first()
          .click();

        await expect(page).toHaveURL(paths.smsNotify.appellantTextReminders);
      }
    });

    test(`${language.toUpperCase()} - page have a csrf token`, async ({
      page
    }) => {
      await expect(
        page.locator('form input[name="_csrf"]').first()
      ).toBeVisible();
    });
  }
);
