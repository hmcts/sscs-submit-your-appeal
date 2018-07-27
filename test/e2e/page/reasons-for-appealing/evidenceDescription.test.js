const theHearing = require('steps/hearing/the-hearing/content.en.json');
const content = require('steps/reasons-for-appealing/evidence-description/content.en.json');
const paths = require('paths');

const evidenceUploadEnabled = require('config').get('features.evidenceUpload.enabled');

Feature('Evidence description page @evidence-upload @batch-10');

if (evidenceUploadEnabled) {
  Before(I => {
    I.createTheSession();
    I.amOnPage(paths.reasonsForAppealing.evidenceDescription);
  });

  After(I => {
    I.endTheSession();
  });

  Scenario('When I select continue, I am taken to the hearing page', I => {
    I.selectContinue();
    I.seeInCurrentUrl(paths.hearing.theHearing);
    I.see(theHearing.title);
  });

  Scenario('When I enter special characters and select continue, I see errors', I => {
    I.enterDescription('Description with special characters |');
    I.seeInCurrentUrl(paths.reasonsForAppealing.evidenceDescription);
    I.see(content.title);
    I.see(content.fields.describeTheEvidence.error.invalid);
  });

  Scenario('When I enter too sort description and select continue, I see errors', I => {
    I.enterDescription('one');
    I.seeInCurrentUrl(paths.reasonsForAppealing.evidenceDescription);
    I.see(content.title);
    I.see(content.fields.describeTheEvidence.error.tooShort);
  });
}
