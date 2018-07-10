const paths = require('paths');
const content = require('steps/start/postcode-checker/content.en.json');

Feature('Enter postcode @batch-12');

Before(I => {
  I.createTheSession();
  I.amOnPage(paths.start.postcodeCheck);
});

Scenario('When I go to the enter postcode page I see the page heading', I => {
  I.see(content.title);
});

Scenario('When entering a postcode in England, I go to the /are-you-an-appointee page', I => {
  I.fillField('#postcode', 'WV11 2HE');
  I.click('Continue');
  I.seeInCurrentUrl(paths.identity.areYouAnAppointee);
});

Scenario('When I enter a postcode in Scotland, I go to the /invalid postcode page', I => {
  I.fillField('#postcode', 'EH8 8DX');
  I.click('Continue');
  I.seeInCurrentUrl(paths.start.invalidPostcode);
});

Scenario('When I enter an invalid postcode I see an error', I => {
  I.fillField('#postcode', 'INVALID POSTCODE');
  I.click('Continue');
  I.seeInCurrentUrl(paths.start.postcodeCheck);
  I.see(content.fields.postcode.error.invalid);
});

Scenario('When I leave the postcode field empty and continue, I see an error', I => {
  I.fillField('#postcode', '');
  I.click('Continue');
  I.seeInCurrentUrl(paths.start.postcodeCheck);
  I.see(content.fields.postcode.error.emptyField);
});
