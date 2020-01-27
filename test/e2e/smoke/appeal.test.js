const textRemindersContent = require('steps/sms-notify/text-reminders/content.en');
const paths = require('paths');
const mockData = require('test/e2e/data');

const appellant = mockData.appellant;
const doYouWantTextMsgReminders = textRemindersContent.fields.doYouWantTextMsgReminders;

Feature('Full Journey');

Scenario('Appellant full journey from /start-an-appeal to the /check-your-appeal page',
  I => {
    I.amOnPage(paths.session.root);
    I.enterDetailsFromStartToNINO();
    I.enterAppellantContactDetailsWithMobileAndContinue(appellant.contactDetails.phoneNumber);
    I.checkOptionAndContinue(doYouWantTextMsgReminders.yes);
    I.checkOptionAndContinue('#useSameNumber-yes');
    I.readSMSConfirmationAndContinue();
  });

Scenario('debug issue on PR', I => {
  I.amOnPage(paths.session.root);
  I.enterBenefitTypeAndContinue('PIP');
  I.enterPostcodeAndContinue('WV11 2HE');
  I.seeCurrentUrlEquals(paths.start.independence);
  I.waitForClickable({
    css: 'input[type=submit][value=Continue]'
  });
  I.click('Continue');
}).tag('@debug');
