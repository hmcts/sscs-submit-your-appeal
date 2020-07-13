const content = require('commonContent');
const paths = require('paths');

const languages = ['en', 'cy'];

Feature('Other Reasons For Appealing');

languages.forEach(language => {
  const commonContent = content[language];

  Before(I => {
    I.createTheSession(language);
    I.amOnPage(paths.reasonsForAppealing.otherReasonForAppealing);
    I.waitForElement('#otherReasonForAppealing');
  });

  After(I => {
    I.endTheSession();
  });

  Scenario(`${language.toUpperCase()} - When I enter special chars then I see no errors`, I => {
    I.fillField('otherReasonForAppealing', '&$%^&%!~$^&&&*');
    I.click(commonContent.continue);
    I.seeInCurrentUrl(paths.reasonsForAppealing.evidenceProvide);
  });
});
