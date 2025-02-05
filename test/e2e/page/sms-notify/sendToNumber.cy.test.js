const language = 'cy';
const commonContent = require('commonContent')[language];
const textRemindersContent = require(
  `steps/sms-notify/text-reminders/content.${language}`
);
const paths = require('paths');

const { test } = require('@playwright/test');
const {
  createTheSession
} = require('../../page-objects/session/createSession');
const {
  enterAppellantContactDetailsWithMobileAndContinue
} = require('../../page-objects/identity/appellantDetails');
const { endTheSession } = require('../../page-objects/session/endSession');

test.describe(
  `${language.toUpperCase()} - Send to number`,
  { tag: '@batch-11' },
  () => {
    test.beforeEach('Create session', async({ page }) => {
      await createTheSession(page, language);
      await page.goto(paths.identity.enterAppellantContactDetails);
      await enterAppellantContactDetailsWithMobileAndContinue(
        page,
        commonContent,
        language,
        '07466748336'
      );
      await page.waitForURL(`**${paths.smsNotify.appellantTextReminders}`);
      await page
        .getByText(textRemindersContent.fields.doYouWantTextMsgReminders.yes)
        .first()
        .click();
      await page
        .getByRole('button', { name: commonContent.continue })
        .first()
        .click();
    });

    test.afterEach('End session', async({ page }) => {
      await endTheSession(page);
    });

    test(`${language.toUpperCase()} - When page select Yes, page am taken to the sms confirmation page`, async({
      page
    }) => {
      page.selectUseSameNumberAndContinue(commonContent, '#useSameNumber-yes');
      await page.waitForURL(`**${paths.smsNotify.smsConfirmation}`);
    });

    test(`${language.toUpperCase()} - When page select No, page am taken to the enter mobile page`, async({
      page
    }) => {
      page.selectUseSameNumberAndContinue(commonContent, '#useSameNumber-no');
      await page.waitForURL(`**${paths.smsNotify.enterMobile}`);
    });
  }
);
