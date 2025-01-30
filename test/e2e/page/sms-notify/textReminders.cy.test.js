const language = 'cy';
const commonContent = require('commonContent')[language];
const textRemindersContent = require(`steps/sms-notify/text-reminders/content.${language}`);
const paths = require('paths');

const { test } = require('@playwright/test');
const {
  enterAppellantContactDetailsAndContinue,
  enterAppellantContactDetailsWithMobileAndContinue
} = require('../../page-objects/identity/appellantDetails');
const { endTheSession } = require('../../page-objects/session/endSession');
const { createTheSession } = require('../../page-objects/session/createSession');

test.describe(`${language.toUpperCase()} - Text Reminders - appellant contact details`, { tag: '@batch-11' }, () => {
  test.beforeEach('Create session', async({ page }) => {
    await createTheSession(page, language);
    await page.goto(paths.identity.enterAppellantContactDetails);
  });

  test.afterEach('End session', async({ page }) => {
    await endTheSession(page);
  });

  test(`${language.toUpperCase()} - Enter mobile and click Sign up, page am taken to the send to number page`, async({ page }) => {
    await enterAppellantContactDetailsWithMobileAndContinue(page, commonContent, language);
    await page.getByText(textRemindersContent.fields.doYouWantTextMsgReminders.yes).first().click();
    await page.getByRole('button', { name: commonContent.continue }).first().click();
    await page.waitForURL(`**${paths.smsNotify.sendToNumber}`);
  });

  test(`${language.toUpperCase()} - Enter mobile and click do not sign up, page am taken to the representative page`, async({ page }) => {
    await enterAppellantContactDetailsWithMobileAndContinue(page, commonContent, language);
    await page.getByText(textRemindersContent.fields.doYouWantTextMsgReminders.no).first().click();
    await page.getByRole('button', { name: commonContent.continue }).first().click();
    await page.waitForURL(`**${paths.representative.representative}`);
  });

  test(`${language.toUpperCase()} - Do not enter mobile and click Sign up, page am taken to the enter mobile page`, async({ page }) => {
    await enterAppellantContactDetailsAndContinue(page, commonContent, language);
    await page.getByText(textRemindersContent.fields.doYouWantTextMsgReminders.yes).first().click();
    await page.getByRole('button', { name: commonContent.continue }).first().click();
    await page.waitForURL(`**${paths.smsNotify.enterMobile}`);
  });
});
