const theHearing = require('steps/hearing/the-hearing/content.en.json');
const evidenceUpload = require('steps/reasons-for-appealing/evidence-upload/content.en.json');
const evidenceProvide = require('steps/reasons-for-appealing/evidence-provide/content.en.json');
const paths = require('paths');

const evidenceUploadEnabled = require('config').get('features.evidenceUpload.enabled');

Feature('Evidence provide page @batch-10');

if (evidenceUploadEnabled) {
  Before(I => {
    I.createTheSession();
    I.amOnPage(paths.reasonsForAppealing.evidenceProvide);
  });

  After(I => {
    I.endTheSession();
  });

  Scenario('When I select Yes, I am taken to the evidence upload page', I => {
    I.selectAreYouProvidingEvidenceAndContinue(evidenceProvide.fields.evidenceProvide.yes);
    I.seeInCurrentUrl(paths.reasonsForAppealing.evidenceUpload);
    I.see(evidenceUpload.title);
  });

  Scenario('When I select No, I am taken to the hearing page', I => {
    I.selectAreYouProvidingEvidenceAndContinue(evidenceProvide.fields.evidenceProvide.no);
    I.seeInCurrentUrl(paths.hearing.theHearing);
    I.see(theHearing.title);
  });
}
