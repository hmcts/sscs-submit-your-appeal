const paths = require('paths');


/* eslint-disable global-require */
/* eslint-disable max-len */
if (require('config').get('features.allowESA.enabled') === 'true') {
  Feature('Appellant who chooses ESA @batch-01 @esa');

  Before(I => {
    I.createTheSession();
    I.seeCurrentUrlEquals(paths.start.languagePreference);
    I.seeCurrentUrlEquals(paths.start.benefitType);
  });

  After(I => {
    I.endTheSession();
  });
  /* eslint-disable max-len */
  Scenario('Sees an appropriate message on haveAMRN', I => {
    I.chooseLanguagePreference('no');
    I.enterBenefitTypeAndContinue('ESA');
    I.amOnPage(paths.compliance.haveAMRN);
    I.see('This is the letter DWP sent you when you asked them to reconsider their decision about the ESA benefit.');
  });
  Scenario('Sees an appropriate message on reason for appealing', I => {
    I.chooseLanguagePreference('no');
    I.enterBenefitTypeAndContinue('ESA');
    I.amOnPage(paths.reasonsForAppealing.reasonForAppealing);
    I.see('DWP should have explained their decision on your entitlement to ESA in the Mandatory Reconsideration Notice (MRN) or the decision letter they sent you.');
  });
  Scenario('Sees an appropriate message on independence', I => {
    I.chooseLanguagePreference('no');
    I.enterBenefitTypeAndContinue('ESA');
    I.amOnPage(paths.start.independence);
    I.see('Your appeal will be reviewed by a tribunal made up of a judge and a doctor.');
    I.see('They will consider everything you tell them and make a decision on your entitlement to the ESA benefit.');
  });
  /* eslint-enable max-len */
  /* eslint-enable global-require */
}
