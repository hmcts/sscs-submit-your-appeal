'use strict';

const urls = require('urls');
const content = require('steps/sms-notify/sms-confirmation/content.en.json');
const remindersContent = require('steps/sms-notify/text-reminders/content.en.json');

function goToSmsConfirmWithMobileNumber() {

    const I = this;

    I.enterAppellantDetailsWithMobileAndContinue();
    I.click(remindersContent.signUp);
    I.selectUseSameNumberAndContinue('#SendToNumber_useSameNumber-yes');
    I.seeInCurrentUrl(urls.smsNotify.smsConfirmation);

}

module.exports = { goToSmsConfirmWithMobileNumber };
