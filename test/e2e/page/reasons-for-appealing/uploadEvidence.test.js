const paths = require('paths');
const content = require('steps/reasons-for-appealing/evidence-upload/content.en');
const evidenceProvide = require('steps/reasons-for-appealing/evidence-provide/content.en.json');

const evidenceUploadEnabled = require('config').get('features.evidenceUpload.enabled');

Feature('Uploading Evidence @evidence-upload @batch-10');

if (evidenceUploadEnabled) {
  Before(I => {
    I.createTheSession();
    I.amOnPage(paths.reasonsForAppealing.evidenceProvide);
    I.selectAreYouProvidingEvidenceAndContinue(evidenceProvide.fields.evidenceProvide.yes);
  });

  Scenario('I can upload correctly a file', I => {
    I.attachFile('#uploadEv', 'evidence.txt');
    I.dontSeeElement('.error-summary');
  });

  Scenario('I cannot upload the wrong type of file', I => {
    I.attachFile('#uploadEv', 'evidence.zip');
    I.seeElement('.error-summary');
    I.see(content.fields.uploadEv.error.wrongFileType);
  });

  Scenario('I cannot upload a very large file', I => {
    I.attachFile('#uploadEv', 'largefile.txt');
    I.seeElement('.error-summary');
    I.see(content.fields.uploadEv.error.maxFileSizeExceeded);
  });

  Scenario('I see an error if I submit the form without uploading a file', I => {
    I.click('.button');
    I.seeElement('.error-summary');
    I.see(content.noItemsError);
  });
  Scenario('SSCS-3768 bug', I => {
    I.click('.button');
    I.seeElement('.error-summary');
    I.see(content.noItemsError);
    I.attachFile('#uploadEv', 'evidence.txt');
    I.dontSeeElement('.error-summary');
    I.seeInCurrentUrl(paths.reasonsForAppealing.evidenceUpload);
  });
}