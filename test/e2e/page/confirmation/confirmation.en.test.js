const language = 'en';
const commonContent = require('commonContent')[language];
const confirmationContent = require(`steps/confirmation/content.${language}`);
const paths = require('paths');
const urls = require('urls');

Feature(`${language.toUpperCase()} - Confirmation @batch-08`);

Before(({ I }) => {
  I.createTheSession(language);
  I.amOnPage(paths.confirmation);
});

After(({ I }) => {
  I.endTheSession();
});

Scenario(`${language.toUpperCase()} - When I go to the page I see the header`, ({ I }) => {
  I.see(confirmationContent.title);
});

Scenario(`${language.toUpperCase()} - When I click the Continue button I am taken to the smart survey page`, ({ I }) => {
  I.click(commonContent.continue);
  I.seeInCurrentUrl(urls.surveyLink);
});
