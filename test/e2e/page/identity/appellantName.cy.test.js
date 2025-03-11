const language = 'cy';
const commonContent = require('commonContent')[language];
const appellantNameContent = require(
  `steps/identity/appellant-name/content.${language}`
);
const paths = require('paths');

const { test, expect } = require('@playwright/test');
const { endTheSession } = require('../../page-objects/session/endSession');
const {
  createTheSession
} = require('../../page-objects/session/createSession');

test.describe(
  `${language.toUpperCase()} - Appellant Name form`,
  { tag: '@batch-09' },
  () => {
    test.beforeEach('Create session', async({ page }) => {
      await createTheSession(page, language);
      await page.goto(paths.identity.enterAppellantName);
    });

    test.afterEach('End session', async({ page }) => {
      await endTheSession(page);
    });

    test(`${language.toUpperCase()} - When page fill in the fields and click Continue, page am taken to /enter-appellant-dob`, async({
      page
    }) => {
      await page.locator('#title').first().fill('Mr');
      await page.locator('#firstName').first().fill('Harry');
      await page.locator('#lastName').first().fill('Potter');
      await page
        .getByRole('button', { name: commonContent.continue })
        .first()
        .click();
      await expect(page).toHaveURL(paths.identity.enterAppellantDOB);
    });

    test(`${language.toUpperCase()} - When page only provide a single character for firstName and lastName page see errors`, async({
      page
    }) => {
      await page.locator('#firstName').fill('H');
      await page.locator('#lastName').fill('P');
      await page
        .getByRole('button', { name: commonContent.continue })
        .first()
        .click();
      await expect(
        page
          .getByText(appellantNameContent.fields.firstName.error.invalid)
          .first()
      ).toBeVisible();
      await expect(
        page
          .getByText(appellantNameContent.fields.lastName.error.invalid)
          .first()
      ).toBeVisible();
    });

    test(`${language.toUpperCase()} - When page click Continue without filling in the fields page see errors`, async({
      page
    }) => {
      await page
        .getByRole('button', { name: commonContent.continue })
        .first()
        .click();
      await expect(
        page.getByText(appellantNameContent.fields.title.error.required).first()
      ).toBeVisible();
      await expect(
        page
          .getByText(appellantNameContent.fields.firstName.error.required)
          .first()
      ).toBeVisible();
      await expect(
        page
          .getByText(appellantNameContent.fields.lastName.error.required)
          .first()
      ).toBeVisible();
    });
  }
);
