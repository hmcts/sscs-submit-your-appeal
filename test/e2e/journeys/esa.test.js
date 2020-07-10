const content = require('commonContent');
const haveAMRNContentEn = require('steps/compliance/have-a-mrn/content.en');
const haveAMRNContentCy = require('steps/compliance/have-a-mrn/content.cy');
const reasonForAppealingContentEn = require('steps/reasons-for-appealing/reason-for-appealing/content.en');
const reasonForAppealingContentCy = require('steps/reasons-for-appealing/reason-for-appealing/content.cy');
const independenceContentEn = require('steps/start/independence/content.en');
const independenceContentCy = require('steps/start/independence/content.cy');
const paths = require('paths');

/* eslint-disable global-require */
/* eslint-disable max-len */
if (require('config').get('features.allowESA.enabled') === 'true') {
  const languages = ['en', 'cy'];

  Feature('Appellant who chooses ESA @batch-01 @esa');

  languages.forEach(language => {
    Before(I => {
      I.createTheSession(language);
      I.seeCurrentUrlEquals(paths.start.benefitType);
      I.seeCurrentUrlEquals(paths.start.languagePreference);
    });

    After(I => {
      I.endTheSession();
    });

    const commonContent = content[language];
    const haveAMRNContent = language === 'en' ? haveAMRNContentEn : haveAMRNContentCy;
    const reasonForAppealingContent = language === 'en' ? reasonForAppealingContentEn : reasonForAppealingContentCy;
    const independenceContent = language === 'en' ? independenceContentEn : independenceContentCy;

    /* eslint-disable max-len */
    Scenario(`${language.toUpperCase()} - Sees an appropriate message on haveAMRN`, I => {
      I.enterBenefitTypeAndContinue(commonContent, 'ESA');
      // I.chooseLanguagePreference(commonContent, 'no');
      I.amOnPage(paths.compliance.haveAMRN);
      I.see(haveAMRNContent.esa.subtitle);
    });

    Scenario(`${language.toUpperCase()} - Sees an appropriate message on reason for appealing`, I => {
      I.enterBenefitTypeAndContinue(commonContent, 'ESA');
      // I.chooseLanguagePreference(commonContent, 'no');
      I.amOnPage(paths.reasonsForAppealing.reasonForAppealing);
      I.see(reasonForAppealingContent.dwpExplained);
    });

    Scenario(`${language.toUpperCase()} - Sees an appropriate message on independence`, I => {
      I.enterBenefitTypeAndContinue(commonContent, 'ESA');
      // I.chooseLanguagePreference(commonContent, 'no');
      I.amOnPage(paths.start.independence);
      I.see(independenceContent.reviewed);
    });
    /* eslint-enable max-len */
    /* eslint-enable global-require */
  });
}
