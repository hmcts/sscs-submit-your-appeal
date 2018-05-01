/* eslint-disable max-len */

const paths = require('paths');

const dynamicContent = postOrEmail => `You'll receive the address to send it by ${postOrEmail} after submitting your appeal.`;

Feature('Not Attending Hearing');

Before(I => {
  I.createTheSession();
  I.amOnPage(paths.hearing.notAttendingHearing);
});

After(I => {
  I.endTheSession();
});

Scenario('When I omit the email address on /enter-appellant-contact-details, I see post content on /not-attending-hearing', I => {
  I.see(dynamicContent('post'));
});

Scenario('When I enter an email address on /enter-appellant-contact-details, I see the email content /not-attending-hearing', I => {
  I.amOnPage(paths.identity.enterAppellantContactDetails);
  I.enterAppellantContactDetailsWithEmailAndContinue();
  I.amOnPage(paths.hearing.notAttendingHearing);
  I.see(dynamicContent('email'));
});

Scenario('When I click Continue, I am taken to the check your appeal page', I => {
  I.continueFromnotAttendingHearing();
  I.seeInCurrentUrl(paths.checkYourAppeal);
});
