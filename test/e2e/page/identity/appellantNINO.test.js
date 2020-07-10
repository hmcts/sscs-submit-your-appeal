const content = require('steps/identity/appellant-nino/content.en');
const paths = require('paths');

Feature('Appellant NINO form @batch-09');

Before(I => {
  I.createTheSession();
  I.amOnPage(paths.identity.enterAppellantNINO);
});

After(I => {
  I.endTheSession();
});

Scenario('I see the correct information is displayed', I => {
  I.see(content.title);
  I.see(content.subtitle);
});

Scenario('The user has entered a NINO in the correct format (e.g. AA123456A) and continued', I => {
  I.fillField('#nino', 'AA123456A');
  I.click('Continue');
  I.seeInCurrentUrl(paths.identity.enterAppellantContactDetails);
});

Scenario('The user has entered a NINO in the wrong format (e.g.AA1234) and continued', I => {
  I.fillField('#nino', 'AA1234');
  I.click('Continue');
  I.seeElement('#error-summary-title');
  I.see('There was a problem');
  I.see(content.fields.nino.error.required);
});
