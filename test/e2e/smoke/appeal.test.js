const content = require('commonContent');
const doYouWantTextMsgRemindersContentEn = require('steps/sms-notify/text-reminders/content.en');
const doYouWantTextMsgRemindersContentCy = require('steps/sms-notify/text-reminders/content.cy');
const paths = require('paths');
const mockData = require('test/e2e/data');

const appellant = mockData.appellant;

const languages = ['en', 'cy'];

Feature('Full Journey');

languages.forEach(language => {
  const commonContent = content[language];
  const doYouWantTextMsgRemindersContent = language === 'en' ? doYouWantTextMsgRemindersContentEn : doYouWantTextMsgRemindersContentCy;

  Scenario('Appellant full journey from /start-an-appeal to the /check-your-appeal page', I => {
    I.amOnPage(`${paths.session.root}?lng=${language}`);
    I.wait(2);
    I.enterDetailsFromStartToNINO(commonContent, language);
    I.enterAppellantContactDetailsWithMobileAndContinue(commonContent, appellant.contactDetails.phoneNumber);
    I.checkOptionAndContinue(commonContent, doYouWantTextMsgRemindersContent.fields.doYouWantTextMsgReminders.yes);
    I.checkOptionAndContinue(commonContent, '#useSameNumber-yes');
    I.readSMSConfirmationAndContinue(commonContent);
  }).retry(1).tag('@smoke');
});
