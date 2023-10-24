const language = 'en';
const cantAppealContent = require(`steps/compliance/cant-appeal/content.${language}`);
const paths = require('paths');

Feature(`${language.toUpperCase()} - Cannot appeal @batch-07`);

Before(({ I }) => {
  I.createTheSession(language);
  I.amOnPage(paths.compliance.cantAppeal);
});

After(({ I }) => {
  I.endTheSession();
});

Scenario(`${language.toUpperCase()} - I exit the service after being told I cannot appeal`, ({ I }) => {
  I.click(cantAppealContent.govuk);
  I.amOnPage('https://www.gov.uk');
});

Scenario(`${language.toUpperCase()} - I have a csrf token`, ({ I }) => {
  I.seeElementInDOM('form input[name="_csrf"]');
});
