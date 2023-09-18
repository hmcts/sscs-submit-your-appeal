const language = 'cy';
const commonContent = require('commonContent')[language];
const textRemindersContent = require(`steps/sms-notify/text-reminders/content.${language}`);
const paths = require('paths');

Feature(`${language.toUpperCase()} - Text Reminders - appellant contact details @batch-11`);

Before(({ I }) => {
  I.createTheSession(language);
  I.amOnPage(paths.identity.enterAppellantContactDetails);
});

After(({ I }) => {
  I.endTheSession();
});

Scenario(`${language.toUpperCase()} - Enter mobile and click Sign up, I am taken to the send to number page`, ({ I }) => {
  I.enterAppellantContactDetailsWithMobileAndContinue(commonContent, language);
  I.click(textRemindersContent.fields.doYouWantTextMsgReminders.yes);
  I.click(commonContent.continue);
  I.seeInCurrentUrl(paths.smsNotify.sendToNumber);
});

Scenario(`${language.toUpperCase()} - Enter mobile and click do not sign up, I am taken to the representative page`, ({ I }) => {
  I.enterAppellantContactDetailsWithMobileAndContinue(commonContent, language);
  I.click(textRemindersContent.fields.doYouWantTextMsgReminders.no);
  I.click(commonContent.continue);
  I.seeInCurrentUrl(paths.representative.representative);
});

Scenario(`${language.toUpperCase()} - Do not enter mobile and click Sign up, I am taken to the enter mobile page`, ({ I }) => {
  I.enterAppellantContactDetailsAndContinue(commonContent, language);
  I.click(textRemindersContent.fields.doYouWantTextMsgReminders.yes);
  I.click(commonContent.continue);
  I.seeInCurrentUrl(paths.smsNotify.enterMobile);
});
