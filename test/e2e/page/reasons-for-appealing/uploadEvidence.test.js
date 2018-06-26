const paths = require('paths');
const config = require('config');
const content = require('steps/reasons-for-appealing/evidence-upload/content.en');


Feature('Uploading Evidence');

if (config.get('features.evidenceUpload.enabled')) {
  Before(I => {
    I.createTheSession();
    I.amOnPage(paths.reasonsForAppealing.sendingEvidence);
  });

  Scenario('I can upload correctly a file', I => {
    I.click('Continue');
    I.attachFile('#uploadEv', 'evidence.txt');
    I.click('.button');
    I.dontSeeElement('.error-summary');
  });
  Scenario('I cannot upload the wrong type of file', I => {
    I.click('Continue');
    I.attachFile('#uploadEv', 'evidence.zip');
    I.click('.button');
    I.seeElement('.error-summary');
    I.see(content.fields.uploadEv.error.wrongFileType);
  });
  Scenario('I cannot upload a very large file', I => {
    I.click('Continue');
    I.attachFile('#uploadEv', 'largefile.txt');
    I.click('.button');
    I.seeElement('.error-summary');
    I.see(content.fields.uploadEv.error.maxFileSizeExceeded);
  });
  Scenario('I see an error if I submit the form without choosing a file', I => {
    I.click('Continue');
    I.click('.button');
    I.seeElement('.error-summary');
    I.see(content.fields.uploadEv.error.required);
  });
}