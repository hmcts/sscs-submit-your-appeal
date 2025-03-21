const language = 'cy';
const commonContent = require('commonContent')[language];
const smsConfirmationContent = require(
  `steps/sms-notify/sms-confirmation/content.${language}`
);
const textRemindersContent = require(
  `steps/sms-notify/text-reminders/content.${language}`
);
const paths = require('paths');

const { test, expect } = require('@playwright/test');
const {
  createTheSession
} = require('../../page-objects/session/createSession');
const { endTheSession } = require('../../page-objects/session/endSession');
const {
  enterAppellantContactDetailsWithMobileAndContinue,
  enterAppellantContactDetailsAndContinue
} = require('../../page-objects/identity/appellantDetails');

test.describe(
  `${language.toUpperCase()} - SMS Confirmation - appellant contact details`,
  { tag: '@batch-11' },
  () => {
    test.beforeEach('Create session', async({ page }) => {
      await createTheSession(page, language);
      await page.goto(paths.identity.enterAppellantContactDetails);
    });

    test.afterEach('End session', async({ page }) => {
      await endTheSession(page);
    });

    test(`${language.toUpperCase()} - When page click Continue, page am taken to the Representative page`, async({
      page
    }) => {
      await enterAppellantContactDetailsWithMobileAndContinue(
        page,
        commonContent,
        language
      );
      await page
        .getByText(textRemindersContent.fields.doYouWantTextMsgReminders.yes)
        .first()
        .click();
      await page
        .getByRole('button', { name: commonContent.continue })
        .first()
        .click();
      page.selectUseSameNumberAndContinue(commonContent, '#useSameNumber');
      await page.waitForURL(`**${paths.smsNotify.smsConfirmation}`);
      await page
        .getByRole('button', { name: commonContent.continue })
        .first()
        .click();
      await page.waitForURL(`**${paths.representative.representative}`);
    });

    test(`${language.toUpperCase()} - Enter a mobile and click use same number, page see the number in SMS confirmation`, async({
      page
    }) => {
      await enterAppellantContactDetailsWithMobileAndContinue(
        page,
        commonContent,
        language,
        '07466748336'
      );
      await page
        .getByText(textRemindersContent.fields.doYouWantTextMsgReminders.yes)
        .first()
        .click();
      await page
        .getByRole('button', { name: commonContent.continue })
        .first()
        .click();
      page.selectUseSameNumberAndContinue(commonContent, '#useSameNumber');
      await page.waitForURL(`**${paths.smsNotify.smsConfirmation}`);
      await expect(
        page
          .getByText(`${smsConfirmationContent.mobileNumber}07466748336`)
          .first()
      ).toBeVisible();
    });

    test(`${language.toUpperCase()} - Enter a mobile, click use different number, page see enter mobile number`, async({
      page
    }) => {
      await enterAppellantContactDetailsWithMobileAndContinue(
        page,
        commonContent,
        language,
        '07466748336'
      );
      await page
        .getByText(textRemindersContent.fields.doYouWantTextMsgReminders.yes)
        .first()
        .click();
      await page
        .getByRole('button', { name: commonContent.continue })
        .first()
        .click();
      page.selectUseSameNumberAndContinue(commonContent, '#useSameNumber-2');
      await page.waitForURL(`**${paths.smsNotify.enterMobile}`);
      await page.locator('#enterMobile').fill('+447123456789');
      await page
        .getByRole('button', { name: commonContent.continue })
        .first()
        .click();
      await page.waitForURL(`**${paths.smsNotify.smsConfirmation}`);
      await expect(
        page
          .getByText(`${smsConfirmationContent.mobileNumber}+447123456789`)
          .first()
      ).toBeVisible();
    });

    test(`${language.toUpperCase()} - Do not enter a mobile, page see the mobile number page provided for enter mobile`, async({
      page
    }) => {
      await enterAppellantContactDetailsAndContinue(
        page,
        commonContent,
        language
      );
      await page
        .getByText(textRemindersContent.fields.doYouWantTextMsgReminders.yes)
        .first()
        .click();
      await page
        .getByRole('button', { name: commonContent.continue })
        .first()
        .click();
      await page.locator('#enterMobile').fill('+447987654321');
      await page
        .getByRole('button', { name: commonContent.continue })
        .first()
        .click();
      await page.waitForURL(`**${paths.smsNotify.smsConfirmation}`);
      await expect(
        page
          .getByText(`${smsConfirmationContent.mobileNumber}+447987654321`)
          .first()
      ).toBeVisible();
    });
  }
);
