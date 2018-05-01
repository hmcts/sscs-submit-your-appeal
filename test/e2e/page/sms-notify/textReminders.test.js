const paths = require('paths');
const content = require('steps/sms-notify/text-reminders/content.en.json');

Feature('Text Reminders - appellant contact details');

Before(I => {
  I.createTheSession();
  I.amOnPage(paths.identity.enterAppellantContactDetails);
});

After(I => {
  I.endTheSession();
});

Scenario('Enter mobile and click Sign up, I am taken to the send to number page', I => {
  I.enterAppellantContactDetailsWithMobileAndContinue();
  I.click(content.fields.doYouWantTextMsgReminders.yes);
  I.click('Continue');
  I.seeInCurrentUrl(paths.smsNotify.sendToNumber);
});

Scenario('Enter mobile and click do not sign up, I am taken to the representative page', I => {
  I.enterAppellantContactDetailsWithMobileAndContinue();
  I.click(content.fields.doYouWantTextMsgReminders.no);
  I.click('Continue');
  I.seeInCurrentUrl(paths.representative.representative);
});

Scenario('Do not enter mobile and click Sign up, I am taken to the enter mobile page', I => {
  I.enterAppellantContactDetailsAndContinue();
  I.click(content.fields.doYouWantTextMsgReminders.yes);
  I.click('Continue');
  I.seeInCurrentUrl(paths.smsNotify.enterMobile);
});
