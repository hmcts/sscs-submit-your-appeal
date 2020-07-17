const content = require('commonContent');
const checkYourAppealContentEn = require('steps/check-your-appeal/content.en');
const checkYourAppealContentCy = require('steps/check-your-appeal/content.cy');
const paths = require('paths');

const languages = ['en', 'cy'];

Feature('Check-your-appeal');

languages.forEach(language => {
  const commonContent = content[language];
  const checkYourAppealContent = language === 'en' ? checkYourAppealContentEn : checkYourAppealContentCy;

  Before(I => {
    I.createTheSession(language);
  });

  After(I => {
    I.endTheSession();
  });

  Scenario(`${language.toUpperCase()} - When the appeal is incomplete, I am taken to the next step that needs completing`, I => {
    I.amOnPage(paths.checkYourAppeal);
    I.see('Check your answers');
    I.see('Your application is incomplete');
    I.see('There are still some questions to answer');
    I.click('Continue your application');
    I.seeCurrentUrlEquals('/benefit-type');
  });

  Scenario(`${language.toUpperCase()} - When I go to the check your appeal page, I don't see the Sign and submit section`, I => {
    I.enterBenefitTypeAndContinue(commonContent, 'pip');
    // I.chooseLanguagePreference(commonContent, 'no');
    I.amOnPage(paths.checkYourAppeal);
    I.dontSee(checkYourAppealContent.header);
  });
});
