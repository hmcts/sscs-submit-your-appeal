const textRemindersContent = require('steps/sms-notify/text-reminders/content.en');
const paths = require('paths');
const mockData = require('test/e2e/data');

const appellant = mockData.appellant;
const doYouWantTextMsgReminders = textRemindersContent.fields.doYouWantTextMsgReminders;

Feature('Full Journey');

Scenario('Appellant full journey from /start-an-appeal to the /check-your-appeal page @smoke',
  I => {
    I.amOnPage(paths.session.root);
    I.enterDetailsFromStartToNINO();
    I.enterAppellantContactDetailsWithMobileAndContinue(appellant.contactDetails.phoneNumber);
    I.checkOptionAndContinue(doYouWantTextMsgReminders.yes);
    I.checkOptionAndContinue('#useSameNumber-yes');
    I.readSMSConfirmationAndContinue();
  }).retry(2);