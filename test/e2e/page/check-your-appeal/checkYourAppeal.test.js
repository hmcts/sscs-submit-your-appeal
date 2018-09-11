const paths = require('paths');

Feature('Check-your-appeal @functional');

Before(I => {
  I.createTheSession();
});

After(I => {
  I.endTheSession();
});

Scenario('When the appeal is incomplete, I am taken to the next step that needs completing', I => {
  I.amOnPage(paths.checkYourAppeal);
  I.see('Check your answers');
  I.see('Your application is incomplete');
  I.see('There are still some questions to answer');
  I.click('Continue your application');
  I.seeCurrentUrlEquals('/benefit-type');
});

Scenario('When I go to the check your appeal page, I don\'t see the Sign and submit section', I => {
  I.enterBenefitTypeAndContinue('pip');
  I.amOnPage(paths.checkYourAppeal);
  I.dontSee('Sign and submit');
});
