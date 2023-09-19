const language = 'cy';
const evidenceUploadContent = require(`steps/reasons-for-appealing/evidence-upload/content.${language}`);
const evidenceProvideContent = require(`steps/reasons-for-appealing/evidence-provide/content.${language}`);
const paths = require('paths');

const evidenceUploadEnabled = require('config').get('features.evidenceUpload.enabled');

Feature(`${language.toUpperCase()} - Uploading Evidence @evidence-upload @batch-10`);

if (evidenceUploadEnabled) {
  Before(({ I }) => {
    I.createTheSession(language);
    I.amOnPage(paths.reasonsForAppealing.evidenceProvide);
    I.selectAreYouProvidingEvidenceAndContinue(evidenceProvideContent.fields.evidenceProvide.yes);
  });

  Scenario(`${language.toUpperCase()} - I can upload correctly a file`, ({ I }) => {
    I.attachFile('#uploadEv', 'evidence.txt');
    I.dontSeeElement('.govuk-error-summary');
  });

  Scenario(`${language.toUpperCase()} - I cannot upload the wrong type of file`, ({ I }) => {
    I.attachFile('#uploadEv', 'evidence.zip');
    I.seeElement('.govuk-error-summary');
    I.see(evidenceUploadContent.fields.uploadEv.error.wrongFileType);
  });

  Scenario(`${language.toUpperCase()} - I cannot upload a very large file`, ({ I }) => {
    I.attachFile('#uploadEv', 'largefile.txt');
    I.seeElement('.govuk-error-summary');
    I.see(evidenceUploadContent.fields.uploadEv.error.maxFileSizeExceeded);
  });

  Scenario(`${language.toUpperCase()} - I cannot upload more than the total amount of bytes`, ({ I }) => {
    I.attachFile('#uploadEv', 'largeimage.jpg');
    I.wait(1);
    I.attachFile('#uploadEv', 'largeimage.jpg');
    I.wait(1);
    I.attachFile('#uploadEv', 'largeimage.jpg');
    I.wait(1);
    I.attachFile('#uploadEv', 'largeimage.jpg');
    I.seeElement('.govuk-error-summary');
    I.see(evidenceUploadContent.fields.uploadEv.error.totalFileSizeExceeded);
  });

  Scenario(`${language.toUpperCase()} - I see an error if I submit the form without uploading a file`, ({ I }) => {
    I.click('.govuk-button');
    I.seeElement('.govuk-error-summary');
    I.see(evidenceUploadContent.noItemsError);
  });

  Scenario(`${language.toUpperCase()} - SSCS-3768 bug`, ({ I }) => {
    I.click('.govuk-button');
    I.seeElement('.govuk-error-summary');
    I.see(evidenceUploadContent.noItemsError);
    I.attachFile('#uploadEv', 'evidence.txt');
    I.dontSeeElement('.govuk-error-summary');
    I.seeInCurrentUrl(paths.reasonsForAppealing.evidenceUpload);
  });
}
