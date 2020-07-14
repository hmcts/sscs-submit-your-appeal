const contactDwpContentEn = require('steps/compliance/contact-dwp/content.en');
const contactDwpContentCy = require('steps/compliance/contact-dwp/content.cy');
const paths = require('paths');

const languages = ['en', 'cy'];

Feature('Contact DWP @batch-07');

languages.forEach(language => {
  const contactDwpContent = language === 'en' ? contactDwpContentEn : contactDwpContentCy;

  Before(I => {
    I.createTheSession(language);
    I.amOnPage(paths.compliance.contactDWP);
  });

  After(I => {
    I.endTheSession();
  });

  Scenario(`${language.toUpperCase()} - I exit the service after being told I need to contact DWP`, I => {
    I.click(contactDwpContent.govuk);
    I.amOnPage('https://www.gov.uk');
  });
});
