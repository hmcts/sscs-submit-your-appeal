const content = require('commonContent');
const urls = require('urls');
const language = 'en';
const commonContent = content[language];

Feature(`${language.toUpperCase()} - Full Journey @smoke`);

Scenario(`${language.toUpperCase()} - Appellant full journey from /start-an-appeal to the /check-your-appeal page`, ({ I }) => {
  I.amOnPage(`${urls.formDownload.benefitAppeal}/?lng=${language}`);
  I.wait(1);
  I.enterDetailsFromStartToNINO(commonContent, language);
}).retry(1);
