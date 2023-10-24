const language = 'cy';
const commonContent = require('commonContent')[language];
const smsConfirmationContent = require(`steps/sms-notify/sms-confirmation/content.${language}`);
const textRemindersContent = require(`steps/sms-notify/text-reminders/content.${language}`);
const paths = require('paths');

Feature(`${language.toUpperCase()} - SMS Confirmation - appellant contact details @batch-11`);

Before(({ I }) => {
  I.createTheSession(language);
  I.amOnPage(paths.identity.enterAppellantContactDetails);
});

After(({ I }) => {
  I.endTheSession();
});

Scenario(`${language.toUpperCase()} - When I click Continue, I am taken to the Representative page`, ({ I }) => {
  I.enterAppellantContactDetailsWithMobileAndContinue(commonContent, language);
  I.click(textRemindersContent.fields.doYouWantTextMsgReminders.yes);
  I.click(commonContent.continue);
  I.selectUseSameNumberAndContinue(commonContent, '#useSameNumber-yes');
  I.seeInCurrentUrl(paths.smsNotify.smsConfirmation);
  I.click(commonContent.continue);
  I.seeInCurrentUrl(paths.representative.representative);
});

Scenario(`${language.toUpperCase()} - Enter a mobile and click use same number, I see the number in SMS confirmation`, ({ I }) => {
  I.enterAppellantContactDetailsWithMobileAndContinue(commonContent, language, '07466748336');
  I.click(textRemindersContent.fields.doYouWantTextMsgReminders.yes);
  I.click(commonContent.continue);
  I.selectUseSameNumberAndContinue(commonContent, '#useSameNumber-yes');
  I.seeInCurrentUrl(paths.smsNotify.smsConfirmation);
  I.see(`${smsConfirmationContent.mobileNumber}07466748336`);
});

Scenario(`${language.toUpperCase()} - Enter a mobile, click use different number, I see enter mobile number`, ({ I }) => {
  I.enterAppellantContactDetailsWithMobileAndContinue(commonContent, language, '07466748336');
  I.click(textRemindersContent.fields.doYouWantTextMsgReminders.yes);
  I.click(commonContent.continue);
  I.selectUseSameNumberAndContinue(commonContent, '#useSameNumber-no');
  I.seeInCurrentUrl(paths.smsNotify.enterMobile);
  I.fillField('#enterMobile', '+447123456789');
  I.click(commonContent.continue);
  I.seeInCurrentUrl(paths.smsNotify.smsConfirmation);
  I.see(`${smsConfirmationContent.mobileNumber}+447123456789`);
});

Scenario(`${language.toUpperCase()} - Do not enter a mobile, I see the mobile number I provided for enter mobile`, ({ I }) => {
  I.enterAppellantContactDetailsAndContinue(commonContent, language);
  I.click(textRemindersContent.fields.doYouWantTextMsgReminders.yes);
  I.click(commonContent.continue);
  I.fillField('#enterMobile', '+447987654321');
  I.click(commonContent.continue);
  I.seeInCurrentUrl(paths.smsNotify.smsConfirmation);
  I.see(`${smsConfirmationContent.mobileNumber}+447987654321`);
});
