'use strict';

const remindersContent = require('steps/sms-notify/text-reminders/content.en.json');
const paths = require('paths');

Feature('Send to number');

Before((I) => {
    I.createTheSession();
    I.amOnPage(paths.identity.enterAppellantDetails);
    I.enterAppellantDetailsWithMobileAndContinue();
    I.click(remindersContent.signUp);
    I.seeInCurrentUrl(paths.smsNotify.sendToNumber);
});

After((I) => {
    I.endTheSession();
});

Scenario('When I select Yes, I am taken to the sms confirmation page', (I) => {

    I.selectUseSameNumberAndContinue('#SendToNumber_useSameNumber-yes');
    I.seeInCurrentUrl(paths.smsNotify.smsConfirmation);

});

Scenario('When I select No, I am taken to the enter mobile page', (I) => {

    I.selectUseSameNumberAndContinue('#SendToNumber_useSameNumber-no');
    I.seeInCurrentUrl(paths.smsNotify.enterMobile);

});
