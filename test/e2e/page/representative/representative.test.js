const content = require('commonContent');
const paths = require('paths');

const languages = ['en', 'cy'];

Feature('Representative @batch-10');

languages.forEach(language => {
  const commonContent = content[language];

  Before(I => {
    I.createTheSession(language);
    I.amOnPage(paths.representative.representative);
  });

  After(I => {
    I.endTheSession();
  });

  Scenario(`${language.toUpperCase()} - When I select yes, I am taken to the representative details page`, I => {
    I.selectDoYouHaveARepresentativeAndContinue(commonContent, '#hasRepresentative-yes');
    I.seeInCurrentUrl(paths.representative.representativeDetails);
  });

  Scenario(`${language.toUpperCase()} - When I select No, I am taken to the reason for appealing page`, I => {
    I.selectDoYouHaveARepresentativeAndContinue(commonContent, '#hasRepresentative-no');
    I.seeInCurrentUrl(paths.reasonsForAppealing.reasonForAppealing);
  });

  Scenario(`${language.toUpperCase()} - I have a csrf token`, I => {
    I.seeElementInDOM('form input[name="_csrf"]');
  });
});
