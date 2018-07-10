const paths = require('paths');
const content = require('steps/reasons-for-appealing/evidence-upload/content.en');
const evidenceProvide = require('steps/reasons-for-appealing/evidence-provide/content.en.json');

const evidenceUploadEnabled = require('config').get('features.evidenceUpload.enabled');

Feature('Uploading Evidence @batch-10');

if (evidenceUploadEnabled) {
  Before(I => {
    I.createTheSession();
    I.amOnPage(paths.reasonsForAppealing.evidenceProvide);
  });

  Scenario('I can upload correctly a file', I => {
    I.selectAreYouProvidingEvidenceAndContinue(evidenceProvide.fields.evidenceProvide.yes);
    I.click('Continue');
    I.attachFile('#uploadEv', 'evidence.txt');
    I.click('.button');
    I.dontSeeElement('.error-summary');
  });
  Scenario('I cannot upload the wrong type of file', I => {
    I.selectAreYouProvidingEvidenceAndContinue(evidenceProvide.fields.evidenceProvide.yes);
    I.attachFile('#uploadEv', 'evidence.zip');
    I.click('.button');
    I.seeElement('.error-summary');
    I.see(content.fields.uploadEv.error.wrongFileType);
  });
  Scenario('I cannot upload a very large file', I => {
    I.selectAreYouProvidingEvidenceAndContinue(evidenceProvide.fields.evidenceProvide.yes);
    I.attachFile('#uploadEv', 'largefile.txt');
    I.click('.button');
    I.seeElement('.error-summary');
    I.see(content.fields.uploadEv.error.maxFileSizeExceeded);
  });
  Scenario('I see an error if I submit the form without choosing a file', I => {
    I.selectAreYouProvidingEvidenceAndContinue(evidenceProvide.fields.evidenceProvide.yes);
    I.click('.button');
    I.seeElement('.error-summary');
    I.see(content.fields.uploadEv.error.required);
  });
}