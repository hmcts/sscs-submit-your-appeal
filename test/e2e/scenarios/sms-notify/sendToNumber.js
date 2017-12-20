'use strict';

const paths = require('paths');
const textRemindersContent = require('steps/sms-notify/text-reminders/content.en.json');

Feature('Send to number');

Before((I) => {
    I.createTheSession();
    I.amOnPage(paths.identity.enterAppellantContactDetails);
    I.enterAppellantContactDetailsWithMobileAndContinue('07466748336');
    I.seeInCurrentUrl(paths.smsNotify.appellantTextReminders);
    I.click(textRemindersContent.fields.doYouWantTextMsgReminders.yes);
    I.click('Continue');
});

After((I) => {
    I.endTheSession();
});

Scenario('When I select Yes, I am taken to the sms confirmation page', (I) => {

    I.selectUseSameNumberAndContinue('#useSameNumber-yes');
    I.seeInCurrentUrl(paths.smsNotify.smsConfirmation);

});

Scenario('When I select No, I am taken to the enter mobile page', (I) => {

    I.selectUseSameNumberAndContinue('#useSameNumber-no');
    I.seeInCurrentUrl(paths.smsNotify.enterMobile);

});
