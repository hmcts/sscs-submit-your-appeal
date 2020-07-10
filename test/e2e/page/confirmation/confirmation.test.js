const content = require('commonContent');
const confirmationContentEn = require('steps/confirmation/content.en');
const confirmationContentCy = require('steps/confirmation/content.en');
const paths = require('paths');
const urls = require('urls');

const languages = ['en', 'cy'];

Feature('Confirmation @batch-08');

languages.forEach(language => {
  Before(I => {
    I.createTheSession(language);
    I.amOnPage(paths.confirmation);
  });

  After(I => {
    I.endTheSession();
  });

  const commonContent = content[language];
  const confirmationContent = language === 'en' ? confirmationContentEn : confirmationContentCy;

  Scenario(`${language.toUpperCase()} - When I go to the page I see the header`, I => {
    I.see(confirmationContent.title);
  });

  Scenario(`${language.toUpperCase()} - When I click the Continue button I am taken to the smart survey page`, I => {
    I.click(commonContent.continue);
    I.seeInCurrentUrl(urls.surveyLink);
  });
});
