const language = 'cy';
const contactDwpContent = require(`steps/compliance/contact-dwp/content.${language}`);
const paths = require('paths');

Feature(`${language.toUpperCase()} - Contact DWP @batch-07`);

Before(({ I }) => {
  I.createTheSession(language);
  I.amOnPage(paths.compliance.contactDWP);
});

After(({ I }) => {
  I.endTheSession();
});

Scenario(`${language.toUpperCase()} - I exit the service after being told I need to contact DWP`, ({ I }) => {
  I.click(contactDwpContent.govuk);
  I.amOnPage('https://www.gov.uk');
});
