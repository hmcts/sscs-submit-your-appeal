const language = 'cy';
const commonContent = require('commonContent')[language];
const haveAMRNContent = require(`steps/compliance/have-a-mrn/content.${language}`);
const reasonForAppealingContent = require(`steps/reasons-for-appealing/reason-for-appealing/content.${language}`);
const independenceContent = require(`steps/start/independence/content.${language}`);
const paths = require('paths');

/* eslint-disable global-require */
/* eslint-disable max-len */
if (require('config').get('features.allowESA.enabled') === 'true') {
  Feature(`${language.toUpperCase()} - Appellant who chooses ESA @batch-01 @esa`);

  Before(({ I }) => {
    I.createTheSession(language);
    I.seeCurrentUrlEquals(paths.start.benefitType);
    I.seeCurrentUrlEquals(paths.start.languagePreference);
  });

  After(({ I }) => {
    I.endTheSession();
  });

  Scenario(`${language.toUpperCase()} - Sees an appropriate message on haveAMRN`, ({ I }) => {
    I.enterBenefitTypeAndContinue(commonContent, 'ESA');
    // I.chooseLanguagePreference(commonContent, 'no');
    I.amOnPage(paths.compliance.haveAMRN);
    I.see(haveAMRNContent.esa.subtitle);
  });

  Scenario(`${language.toUpperCase()} - Sees an appropriate message on reason for appealing`, ({ I }) => {
    I.enterBenefitTypeAndContinue(commonContent, 'ESA');
    // I.chooseLanguagePreference(commonContent, 'no');
    I.amOnPage(paths.reasonsForAppealing.reasonForAppealing);
    I.see(reasonForAppealingContent.dwpExplained);
  });

  Scenario(`${language.toUpperCase()} - Sees an appropriate message on independence`, ({ I }) => {
    I.enterBenefitTypeAndContinue(commonContent, 'ESA');
    // I.chooseLanguagePreference(commonContent, 'no');
    I.amOnPage(paths.start.independence);
    I.see(independenceContent.reviewed);
  });
  /* eslint-enable global-require */
}
