const language = 'cy';
const theHearingContent = require(`steps/hearing/the-hearing/content.${language}`);
const evidenceUploadContent = require(`steps/reasons-for-appealing/evidence-upload/content.${language}`);
const evidenceProvideContent = require(`steps/reasons-for-appealing/evidence-provide/content.${language}`);
const paths = require('paths');

const evidenceUploadEnabled = require('config').get('features.evidenceUpload.enabled');

Feature(`${language.toUpperCase()} - Evidence provide page @evidence-upload @batch-10`);

if (evidenceUploadEnabled) {
  Before(({ I }) => {
    I.createTheSession(language);
    I.amOnPage(paths.reasonsForAppealing.evidenceProvide);
  });

  After(({ I }) => {
    I.endTheSession();
  });

  Scenario(`${language.toUpperCase()} - When I select Yes, I am taken to the evidence upload page`, ({ I }) => {
    I.selectAreYouProvidingEvidenceAndContinue(language, evidenceProvideContent.fields.evidenceProvide.yes);
    I.seeInCurrentUrl(paths.reasonsForAppealing.evidenceUpload);
    I.see(evidenceUploadContent.title);
  });

  Scenario(`${language.toUpperCase()} - When I select No, I am taken to the hearing page`, ({ I }) => {
    I.selectAreYouProvidingEvidenceAndContinue(language, evidenceProvideContent.fields.evidenceProvide.no);
    I.seeInCurrentUrl(paths.hearing.theHearing);
    I.see(theHearingContent.title);
  });
}
