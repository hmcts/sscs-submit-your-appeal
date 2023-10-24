const content = require('commonContent');
const urls = require('urls');
const mockData = require('test/e2e/data.en');

const appellant = mockData.appellant;

const language = 'en';
const commonContent = content[language];

Feature(`${language.toUpperCase()} - Full Journey @smoke`);

Scenario(`${language.toUpperCase()} - Appellant full journey from /start-an-appeal to the /check-your-appeal page`, ({ I }) => {
  I.amOnPage(`${urls.formDownload.benefitAppeal}/?lng=${language}`);
  I.wait(1);
  I.enterDetailsFromStartToNINO(commonContent, language);
  I.enterAppellantContactDetailsWithMobileAndContinue(commonContent, language, appellant.contactDetails.phoneNumber);
  I.checkOptionAndContinue(commonContent, '#doYouWantTextMsgReminders-yes');
  I.checkOptionAndContinue(commonContent, '#useSameNumber-yes');
  I.readSMSConfirmationAndContinue(commonContent);
}).retry(1);
