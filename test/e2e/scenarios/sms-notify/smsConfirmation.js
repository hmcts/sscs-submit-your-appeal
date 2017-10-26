'use strict';

const paths = require('paths');
const content = require('steps/sms-notify/sms-confirmation/content.en.json');
const remindersContent = require('steps/sms-notify/text-reminders/content.en.json');

Feature('SMS Confirmation');

Before((I) => {
    I.createTheSession();
    I.amOnPage(paths.identity.enterAppellantDetails);
});

After((I) => {
    I.endTheSession();
});

Scenario('When I click Continue, I am taken to the Representative page', (I) => {

    I.goToSmsConfirmWithMobileNumber();
    I.click(content.continue);
    I.seeInCurrentUrl(paths.representative.representative);

});

Scenario('When I enter a mobile number in appellant details and click use same number, I see the mobile number I provided for appellant details', (I) => {

    I.goToSmsConfirmWithMobileNumber();
    I.see('07466748336');

});

Scenario('When I enter a mobile number in appellant details and click use different number, I see the mobile number I provided for enter mobile', (I) => {

    I.enterAppellantDetailsWithMobileAndContinue();
    I.click(remindersContent.signUp);
    I.selectUseSameNumberAndContinue('#SendToNumber_useSameNumber-no');
    I.fillField('#EnterMobile_enterMobile', '+447123456789');
    I.click('Continue');
    I.seeInCurrentUrl(paths.smsNotify.smsConfirmation);
    I.see('+447123456789');

});

Scenario('When I don\'t enter a mobile number in appellant details, I see the mobile number I provided for enter mobile', (I) => {

    I.enterRequiredAppellantDetails();
    I.click('Continue');
    I.click(remindersContent.signUp);
    I.fillField('#EnterMobile_enterMobile', '+447987654321');
    I.click('Continue');
    I.seeInCurrentUrl(paths.smsNotify.smsConfirmation);
    I.see('+447987654321');

});
