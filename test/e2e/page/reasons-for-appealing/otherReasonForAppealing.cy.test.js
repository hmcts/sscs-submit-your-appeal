const language = 'cy';
const commonContent = require('commonContent')[language];
const paths = require('paths');

Feature(`${language.toUpperCase()} - Other Reasons For Appealing`);

Before(({ I }) => {
  I.createTheSession(language);
  I.amOnPage(paths.reasonsForAppealing.otherReasonForAppealing);
  I.waitForElement('#otherReasonForAppealing');
});

After(({ I }) => {
  I.endTheSession();
});

Scenario(`${language.toUpperCase()} - When I enter special chars then I see no errors`, ({ I }) => {
  I.fillField('otherReasonForAppealing', '&$%^&%!~$^&&&*');
  I.click(commonContent.continue);
  I.seeInCurrentUrl(paths.reasonsForAppealing.evidenceProvide);
});
