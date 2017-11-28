'use strict';

function selectDoYouWantToReceiveTextMessageReminders(option) {

    const I = this;

    I.checkOption(option);
    I.click('Continue');
}

module.exports = { selectDoYouWantToReceiveTextMessageReminders };

