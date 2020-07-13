const theHearingContentEn = require('steps/hearing/the-hearing/content.en');
const theHearingContentCy = require('steps/hearing/the-hearing/content.cy');
const evidenceUploadContentEn = require('steps/reasons-for-appealing/evidence-upload/content.en');
const evidenceUploadContentCy = require('steps/reasons-for-appealing/evidence-upload/content.cy');
const evidenceProvideContentEn = require('steps/reasons-for-appealing/evidence-provide/content.en');
const evidenceProvideContentCy = require('steps/reasons-for-appealing/evidence-provide/content.cy');
const paths = require('paths');

const evidenceUploadEnabled = require('config').get('features.evidenceUpload.enabled');

const languages = ['en', 'cy'];

Feature('Evidence provide page @evidence-upload @batch-10');

if (evidenceUploadEnabled) {
  languages.forEach(language => {
    const theHearingContent = language === 'en' ? theHearingContentEn : theHearingContentCy;
    const evidenceUploadContent = language === 'en' ? evidenceUploadContentEn : evidenceUploadContentCy;
    const evidenceProvideContent = language === 'en' ? evidenceProvideContentEn : evidenceProvideContentCy;

    Before(I => {
      I.createTheSession(language);
      I.amOnPage(paths.reasonsForAppealing.evidenceProvide);
    });

    After(I => {
      I.endTheSession();
    });

    Scenario(`${language.toUpperCase()} - When I select Yes, I am taken to the evidence upload page`, I => {
      I.selectAreYouProvidingEvidenceAndContinue(evidenceProvideContent.fields.evidenceProvide.yes);
      I.seeInCurrentUrl(paths.reasonsForAppealing.evidenceUpload);
      I.see(evidenceUploadContent.title);
    });

    Scenario(`${language.toUpperCase()} - When I select No, I am taken to the hearing page`, I => {
      I.selectAreYouProvidingEvidenceAndContinue(evidenceProvideContent.fields.evidenceProvide.no);
      I.seeInCurrentUrl(paths.hearing.theHearing);
      I.see(theHearingContent.title);
    });
  });
}
