'use strict';

const paths = require('paths');
const dynamicContent = postOrEmail => `You’ll receive this by ${postOrEmail} after you’ve submitted your appeal.`;

Feature('Not Attending Hearing');

Before((I) => {
    I.createTheSession();
    I.amOnPage(paths.hearing.notAttendingHearing);
});

After((I) => {
    I.endTheSession();
});

Scenario('When I don\'t enter an email address on the enter appellant contact details page, I see the non-email content', (I) => {

    I.see(dynamicContent('post'));

});

Scenario('When I enter an email address on the enter appellant contact details page, I see the email content', (I) => {

    I.amOnPage(paths.identity.enterAppellantContactDetails);
    I.enterAppellantContactDetailsWithEmailAndContinue();
    I.amOnPage(paths.hearing.notAttendingHearing);
    I.see(dynamicContent('email'));

});

Scenario('When I click Continue, I am taken to the check your appeal page', (I) => {

    I.continueFromnotAttendingHearing();
    I.seeInCurrentUrl(paths.checkYourAppeal);

});
