const paths = require('paths');
const content = require('steps/confirmation/content.en.json');
const urls = require('urls');

Feature('Confirmation');

Before(I => {
  I.createTheSession();
  I.amOnPage(paths.confirmation);
});

After(I => {
  I.endTheSession();
});

Scenario('When I go to the page I see the header', I => {
  I.see(content.title);
});

Scenario('When I click the Continue button I am taken to the smart survey page', I => {
  I.click('Continue');
  I.seeInCurrentUrl(urls.surveyLink);
});
