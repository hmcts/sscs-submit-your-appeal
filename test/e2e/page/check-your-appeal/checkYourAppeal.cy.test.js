const language = 'cy';
const commonContent = require('commonContent')[language];
const checkYourAppealContent = require(`steps/check-your-appeal/content.${language}`);
const paths = require('paths');

Feature(`${language.toUpperCase()} - Check-your-appeal @functional`);

Before(I => {
  I.createTheSession(language);
});

After(I => {
  I.endTheSession();
});

Scenario(`${language.toUpperCase()} - When the appeal is incomplete, I am taken to the next step that needs completing`, I => {
  I.amOnPage(paths.checkYourAppeal);
  I.see('Gwiriwch eich atebion');
  I.see('Mae eich cais yn anghyflawn');
  I.see('Mae yna gwestiynau nad ydych wedi’u hateb.');
  I.click('Parhau á’ch cais');
  I.seeCurrentUrlEquals('/benefit-type');
});

Scenario(`${language.toUpperCase()} - When I go to the check your appeal page, I don't see the Sign and submit section`, I => {
  I.enterBenefitTypeAndContinue(commonContent, 'pip');
  // I.chooseLanguagePreference(commonContent, 'no');
  I.amOnPage(paths.checkYourAppeal);
  I.dontSee(checkYourAppealContent.header);
});
