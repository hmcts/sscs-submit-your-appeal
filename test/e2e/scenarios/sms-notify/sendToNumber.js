'use strict';

const remindersContent = require('steps/sms-notify/text-reminders/content.en.json');
const urls = require('urls');

Feature('Send to number');

Before((I) => {
    I.createTheSession();
    I.amOnPage(urls.identity.enterAppellantDetails);
    I.enterAppellantDetailsWithMobileAndContinue();
    I.click(remindersContent.signUp);
    I.seeInCurrentUrl(urls.smsNotify.sendToNumber);
});

After((I) => {
    I.endTheSession();
});

Scenario('When I select Yes, I am taken to the sms confirmation page', (I) => {

    I.selectUseSameNumberAndContinue('#SendToNumber_useSameNumber-yes');
    I.seeInCurrentUrl(urls.smsNotify.smsConfirmation);

});

Scenario('When I select No, I am taken to the enter mobile page', (I) => {

    I.selectUseSameNumberAndContinue('#SendToNumber_useSameNumber-no');
    I.seeInCurrentUrl(urls.smsNotify.enterMobile);

});
