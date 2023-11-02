const language = 'cy';
const commonContent = require('commonContent')[language];
const postcodeCheckerContent = require(`steps/start/postcode-checker/content.${language}`);
const paths = require('paths');

Feature(`${language.toUpperCase()} - Enter postcode`);

Before(({ I }) => {
  I.createTheSession(language);
  I.amOnPage(paths.start.postcodeCheck);
});

Scenario(`${language.toUpperCase()} - When I go to the enter postcode page I see the page heading`, ({ I }) => {
  I.see(postcodeCheckerContent.title);
});

Scenario(`${language.toUpperCase()} - When entering a postcode in England, I go to the /are-you-an-appointee page`, ({ I }) => {
  I.fillField('#postcode', 'WV11 2HE');
  I.click(commonContent.continue);
  I.seeInCurrentUrl(paths.identity.areYouAnAppointee);
});

Scenario(`${language.toUpperCase()} - When I enter a postcode in Scotland, I go to the /invalid postcode page`, ({ I }) => {
  I.fillField('#postcode', 'EH8 8DX');
  I.click(commonContent.continue);
  I.seeInCurrentUrl(paths.start.invalidPostcode);
});

Scenario(`${language.toUpperCase()} - When I enter an invalid postcode I see an error`, ({ I }) => {
  I.fillField('#postcode', 'INVALID POSTCODE');
  I.click(commonContent.continue);
  I.seeInCurrentUrl(paths.start.postcodeCheck);
  I.see(postcodeCheckerContent.fields.postcode.error.invalid);
});

Scenario(`${language.toUpperCase()} - When I leave the postcode field empty and continue, I see an error`, ({ I }) => {
  I.fillField('#postcode', '');
  I.click(commonContent.continue);
  I.seeInCurrentUrl(paths.start.postcodeCheck);
  I.see(postcodeCheckerContent.fields.postcode.error.emptyField);
});
