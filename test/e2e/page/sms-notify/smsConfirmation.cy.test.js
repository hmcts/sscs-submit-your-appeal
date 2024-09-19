/* eslint-disable no-useless-escape */
const language = 'cy';
const commonContent = require('../../../../commonContent')[language];
const smsConfirmationContent = require(`../../../../steps/sms-notify/sms-confirmation/content.${language}`);
const textRemindersContent = require(`../../../../steps/sms-notify/text-reminders/content.${language}`);
const paths = require('../../../../paths');

const { test, expect } = require('@playwright/test');
const { createTheSession } = require('../../page-objects/session/createSession');
const { endTheSession } = require('../../page-objects/session/endSession');
const { enterAppellantContactDetailsWithMobileAndContinue, enterAppellantContactDetailsAndContinue } = require('../../page-objects/identity/appellantDetails');
const { selectUseSameNumberAndContinue } = require('../../page-objects/sms-notify/smsNotify');
const { config } = require('config');

/* eslint-disable-next-line no-process-env */
const baseUrl = process.env.TEST_URL || config.get('e2e.frontendUrl');

test.describe(`${language.toUpperCase()} - SMS Confirmation - appellant contact details @batch-11`, () => {
  test.beforeEach('Initial navigation', async({ page }) => {
    await createTheSession(page, language);
    await page.goto(baseUrl + paths.identity.enterAppellantContactDetails);
  });

  test.afterEach('Close down', async({ page }) => {
    await endTheSession(page);
  });

  test(`${language.toUpperCase()} - When I click Continue, I am taken to the Representative page`, async({ page }) => {
    await enterAppellantContactDetailsWithMobileAndContinue(page, commonContent, language);
    await page.getByText(textRemindersContent.fields.doYouWantTextMsgReminders.yes).first().click();
    await page.getByText(commonContent.continue).first().click();
    await selectUseSameNumberAndContinue(page, commonContent, '#useSameNumber-yes');
    await page.waitForURL(`**\/${paths.smsNotify.smsConfirmation}`);
    await page.getByText(commonContent.continue).first().click();
    await page.waitForURL(`**\/${paths.representative.representative}`);
  });

  test(`${language.toUpperCase()} - Enter a mobile and click use same number, I see the number in SMS confirmation`, async({ page }) => {
    await enterAppellantContactDetailsWithMobileAndContinue(page, commonContent, language, '07466748336');
    await page.getByText(textRemindersContent.fields.doYouWantTextMsgReminders.yes).first().click();
    await page.getByText(commonContent.continue).first().click();
    await selectUseSameNumberAndContinue(page, commonContent, '#useSameNumber-yes');
    await page.waitForURL(`**\/${paths.smsNotify.smsConfirmation}`);
    await expect(page.getByText(`${smsConfirmationContent.mobileNumber}07466748336`).first()).toBeVisible();
  });

  test(`${language.toUpperCase()} - Enter a mobile, click use different number, I see enter mobile number`, async({ page }) => {
    await enterAppellantContactDetailsWithMobileAndContinue(page, commonContent, language, '07466748336');
    await page.getByText(textRemindersContent.fields.doYouWantTextMsgReminders.yes).first().click();
    await page.getByText(commonContent.continue).first().click();
    await selectUseSameNumberAndContinue(page, commonContent, '#useSameNumber-no');
    await page.waitForURL(`**\/${paths.smsNotify.enterMobile}`);
    await page.fill('#enterMobile', '+447123456789');
    await page.getByText(commonContent.continue).first().click();
    await page.waitForURL(`**\/${paths.smsNotify.smsConfirmation}`);
    await expect(page.getByText(`${smsConfirmationContent.mobileNumber}+447123456789`).first()).toBeVisible();
  });

  test(`${language.toUpperCase()} - Do not enter a mobile, I see the mobile number I provided for enter mobile`, async({ page }) => {
    await enterAppellantContactDetailsAndContinue(page, commonContent, language);
    await page.getByText(textRemindersContent.fields.doYouWantTextMsgReminders.yes).first().click();
    await page.getByText(commonContent.continue).first().click();
    await page.fill('#enterMobile', '+447987654321');
    await page.getByText(commonContent.continue).first().click();
    await page.waitForURL(`**\/${paths.smsNotify.smsConfirmation}`);
    await expect(page.getByText(`${smsConfirmationContent.mobileNumber}+447987654321`).first()).toBeVisible();
  });
});
