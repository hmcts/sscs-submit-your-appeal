const language = 'en';
const invalidPostcodeContent = require(`steps/start/invalid-postcode/content.${language}`);
const paths = require('paths');

Feature(`${language.toUpperCase()} - Invalid postcode @batch-12`);

Before(({ I }) => {
  I.amOnPage(paths.start.invalidPostcode);
});

Scenario(`${language.toUpperCase()} - When I go to the invalid postcode page I see the page heading`, ({ I }) => {
  I.see(invalidPostcodeContent.title);
});
