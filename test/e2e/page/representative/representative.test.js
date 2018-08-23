const paths = require('paths');

Feature('Representative @batch-10');

Before(I => {
  I.createTheSession();
  I.amOnPage(paths.representative.representative);
});

After(I => {
  I.endTheSession();
});

Scenario('When I select yes, I am taken to the representative details page', I => {
  I.selectDoYouHaveARepresentativeAndContinue('#hasRepresentative-yes');
  I.seeInCurrentUrl(paths.representative.representativeDetails);
});

Scenario('When I select No, I am taken to the reason for appealing page', I => {
  I.selectDoYouHaveARepresentativeAndContinue('#hasRepresentative-no');
  I.seeInCurrentUrl(paths.reasonsForAppealing.reasonForAppealing);
});

Scenario('I have a csrf token', I => {
  I.seeElementInDOM('form input[name="_csrf"]');
});