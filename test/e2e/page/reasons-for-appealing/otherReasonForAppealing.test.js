const paths = require('paths');

Feature('Other Reasons For Appealing');

Before(I => {
  I.createTheSession();
  I.amOnPage(paths.reasonsForAppealing.otherReasonForAppealing);
  I.waitForElement('#otherReasonForAppealing');
});
After(I => {
  I.endTheSession();
});

Scenario('When I enter special chars then I see no errors', I => {
  I.fillField('otherReasonForAppealing', '&$%^&%!~$^&&&*');
  I.click('Continue');
  I.seeInCurrentUrl(paths.reasonsForAppealing.evidenceProvide);
});