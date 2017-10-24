'use strict';

const paths = require('paths');
const content = require('steps/sms-notify/text-reminders/content.en.json');

Feature('Text Reminders');

Before((I) => {
    I.createTheSession();
    I.amOnPage(paths.identity.enterAppellantDetails);
});

After((I) => {
    I.endTheSession();
});

Scenario('When I enter a mobile number in the appellant details page and click Sign up, I am taken to the send to number page', (I) => {

    I.enterAppellantDetailsWithMobileAndContinue();
    I.click(content.signUp);
    I.seeInCurrentUrl(paths.smsNotify.sendToNumber);

});

Scenario('When I enter a mobile number in the appellant details page and click don\'t sign up, I am taken to the representative page', (I) => {

    I.enterAppellantDetailsWithMobileAndContinue();
    I.click(content.noThanks);
    I.seeInCurrentUrl(paths.representative.representative);

});

Scenario('When I don\'t enter a mobile number in the appellant details page and click Sign up, I am taken to the enter mobile page', (I) => {

    I.enterRequiredAppellantDetails();
    I.click('Continue');
    I.click(content.signUp);
    I.seeInCurrentUrl(paths.smsNotify.enterMobile);

});
