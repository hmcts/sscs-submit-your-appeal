const paths = require('paths');
const content = require('steps/reasons-for-appealing/reason-for-appealing/content.en');

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
  I.dontSee(content.fields.error.invalid);
});