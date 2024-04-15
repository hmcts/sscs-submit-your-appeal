const language = 'cy';
const commonContent = require('commonContent')[language];
const appellantNinoContent = require(`steps/identity/appellant-nino/content.${language}`);
const paths = require('paths');

Feature(`${language.toUpperCase()} - Appellant NINO form @batch-09`);

Before(({ I }) => {
  I.createTheSession(language);
  I.amOnPage(paths.identity.enterAppellantNINO);
});

After(({ I }) => {
  I.endTheSession();
});

Scenario(`${language.toUpperCase()} - I see the correct information is displayed`, ({ I }) => {
  I.see(appellantNinoContent.title.withoutAppointee);
  I.see(appellantNinoContent.subtitle.withoutAppointee);
});

Scenario(`${language.toUpperCase()} - The user has entered a NINO in the correct format (e.g. AA123456A) and continued`, ({ I }) => {
  I.fillField('#nino', 'AA123456A');
  I.click(commonContent.continue);
  I.seeInCurrentUrl(paths.identity.enterAppellantContactDetails);
});

Scenario(`${language.toUpperCase()} - The user has entered a NINO in the wrong format (e.g.AA1234) and continued`, ({ I }) => {
  I.fillField('#nino', 'AA1234');
  I.click(commonContent.continue);
  I.seeElement('#error-summary-title');
  I.see('There was a problem');
  I.see(appellantNinoContent.fields.nino.error.required);
});
