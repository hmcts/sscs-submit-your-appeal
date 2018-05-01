const paths = require('paths');
const content = require('steps/start/invalid-postcode/content.en.json');

Feature('Invalid postcode');

Before(I => {
  I.amOnPage(paths.start.invalidPostcode);
});

Scenario('When I go to the invalid postcode page I see the page heading', I => {
  I.see(content.title);
});
