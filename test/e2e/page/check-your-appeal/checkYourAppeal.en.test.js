const language = 'en';
const commonContent = require('commonContent')[language];
const checkYourAppealContent = require(`steps/check-your-appeal/content.${language}`);
const paths = require('paths');

Feature(`${language.toUpperCase()} - Check-your-appeal @functional`);

Before(({ I }) => {
  I.createTheSession(language);
});

After(({ I }) => {
  I.endTheSession();
});

Scenario(`${language.toUpperCase()} - When the appeal is incomplete, I am taken to the next step that needs completing`, ({ I }) => {
  I.amOnPage(paths.checkYourAppeal);
  I.see('Check your answers');
  I.see('Your application is incomplete');
  I.see('There are still some questions to answer.');
  I.click('Continue your application');
  I.seeCurrentUrlEquals('/benefit-type');
}).retry(10);

Scenario(`${language.toUpperCase()} - When I go to the check your appeal page, I don't see the Sign and submit section`, ({ I }) => {
  I.enterBenefitTypeAndContinue(language, commonContent, 'pip');
  // I.chooseLanguagePreference(commonContent, 'no');
  I.amOnPage(paths.checkYourAppeal);
  I.dontSee(checkYourAppealContent.header);
}).retry(10);
