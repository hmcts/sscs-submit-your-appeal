const cantAppealContentEn = require('steps/compliance/cant-appeal/content.en');
const cantAppealContentCy = require('steps/compliance/cant-appeal/content.cy');
const paths = require('paths');

const languages = ['en', 'cy'];

Feature('Cannot appeal @batch-07');

languages.forEach(language => {
  const cantAppealContent = language === 'en' ? cantAppealContentEn : cantAppealContentCy;

  Before(I => {
    I.createTheSession(language);
    I.amOnPage(paths.compliance.cantAppeal);
  });

  After(I => {
    I.endTheSession();
  });

  Scenario(`${language.toUpperCase()} - I exit the service after being told I cannot appeal`, I => {
    I.click(cantAppealContent.govuk);
    I.amOnPage('https://www.gov.uk');
  });

  Scenario(`${language.toUpperCase()} - I have a csrf token`, I => {
    I.seeElementInDOM('form input[name="_csrf"]');
  });
});
