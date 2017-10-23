'use strict';

const paths = require('paths');
const content = require('steps/sms-notify/text-reminders/content.en.json');

function goToSmsConfirmWithMobileNumber() {

    const I = this;

    I.enterAppellantDetailsWithMobileAndContinue();
    I.click(content.signUp);
    I.selectUseSameNumberAndContinue('#SendToNumber_useSameNumber-yes');
    I.seeInCurrentUrl(paths.smsNotify.smsConfirmation);

}

module.exports = { goToSmsConfirmWithMobileNumber };
