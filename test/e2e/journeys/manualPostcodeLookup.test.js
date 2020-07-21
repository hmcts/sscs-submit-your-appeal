const textRemindersContent = require('steps/sms-notify/text-reminders/content.en');
const paths = require('paths');


const doYouWantTextMsgReminders = textRemindersContent.fields.doYouWantTextMsgReminders;

Feature('Postcode lookup test for type  Manual @functional');

Before(I => {
  I.createTheSession();
  I.seeCurrentUrlEquals(paths.start.benefitType);
});

After(I => {
  I.endTheSession();
});


Scenario('Appellant enters contact details Manually',
  I => {
    I.amOnPage(paths.session.root);
    I.enterDetailsFromStartToNINO();
    I.enterAppellantContactDetailsManuallyAndContinue();
    I.checkOptionAndContinue(doYouWantTextMsgReminders.no);
    I.enterDetailsFromNoRepresentativeToEnd();
    I.completeEqualityAndDiversity();
    I.confirmDetailsArePresent();
  }).retry(1);
