'use strict';

const paths = require('paths');

Feature('Reason For Appealing');

Before((I) => {
    I.createTheSession();
    I.amOnPage(paths.reasonsForAppealing.reasonForAppealing);
});
After((I) => {
    I.endTheSession();

});

Scenario('Textfield allows to enter new lines', (I) => {

    const text = 'This is a text. \r This is a new line';
    I.enterReasonForAppealingAndContinue(text);
    I.seeInCurrentUrl(paths.reasonsForAppealing.otherReasonForAppealing);

});
